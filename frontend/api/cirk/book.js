const { google } = require('googleapis');

const CIRK_SLOTS = [
  { slot_id: 'thu_10', date: '2026-09-03', time: '10:00' },
  { slot_id: 'thu_12', date: '2026-09-03', time: '12:00' },
  { slot_id: 'thu_15', date: '2026-09-03', time: '15:00' },
  { slot_id: 'thu_17', date: '2026-09-03', time: '17:00' },
  { slot_id: 'fri_10', date: '2026-09-04', time: '10:00' },
  { slot_id: 'fri_12', date: '2026-09-04', time: '12:00' },
  { slot_id: 'fri_15', date: '2026-09-04', time: '15:00' },
  { slot_id: 'fri_17', date: '2026-09-04', time: '17:00' },
  { slot_id: 'sat_10', date: '2026-09-05', time: '10:00' },
  { slot_id: 'sat_12', date: '2026-09-05', time: '12:00' },
  { slot_id: 'sat_15', date: '2026-09-05', time: '15:00' },
  { slot_id: 'sat_17', date: '2026-09-05', time: '17:00' },
  { slot_id: 'sun_10', date: '2026-09-06', time: '10:00' },
  { slot_id: 'sun_12', date: '2026-09-06', time: '12:00' },
  { slot_id: 'sun_15', date: '2026-09-06', time: '15:00' },
  { slot_id: 'sun_17', date: '2026-09-06', time: '17:00' },
];

const VALID_SLOT_IDS = new Set(CIRK_SLOTS.map((s) => s.slot_id));
const SLOTS_BY_ID = Object.fromEntries(CIRK_SLOTS.map((s) => [s.slot_id, s]));
const CIRK_HEADERS = ['slot_id', 'date', 'time', 'first_name', 'whatsapp', 'booked_at'];

function getCredsJson() {
  // Support both naming conventions used across the project
  return process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_CREDENTIALS || null;
}

function getSheetId() {
  return process.env.CIRK_SHEET_ID || null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Diagnostics (visible in Vercel function logs) ─────────────────────────
  const credsJson = getCredsJson();
  const sheetId   = getSheetId();
  console.log('cirk/book: GOOGLE_SERVICE_ACCOUNT_JSON set:', !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  console.log('cirk/book: GOOGLE_CREDENTIALS set:', !!process.env.GOOGLE_CREDENTIALS);
  console.log('cirk/book: CIRK_SHEET_ID set:', !!sheetId, sheetId ? `(${sheetId.slice(0,8)}…)` : '');
  console.log('cirk/book: body:', JSON.stringify(req.body));

  const { slot_id, first_name, whatsapp } = req.body || {};

  if (!slot_id || !first_name || !whatsapp) {
    return res.status(422).json({ detail: 'slot_id, first_name and whatsapp are required' });
  }
  if (!VALID_SLOT_IDS.has(slot_id)) {
    return res.status(400).json({ detail: 'Invalid slot_id' });
  }

  if (!credsJson) {
    console.error('cirk/book: GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_CREDENTIALS not set');
    return res.status(503).json({ detail: 'Booking service unavailable: missing credentials' });
  }

  if (!sheetId) {
    console.error('cirk/book: CIRK_SHEET_ID env var not set');
    return res.status(503).json({ detail: 'Booking service unavailable: CIRK_SHEET_ID not configured' });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  let creds;
  try {
    creds = JSON.parse(credsJson);
    console.log('cirk/book: creds parsed OK, client_email:', creds.client_email);
  } catch (e) {
    console.error('cirk/book: failed to parse credentials JSON:', e.message);
    return res.status(503).json({ detail: 'Booking service unavailable: bad credentials JSON' });
  }

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // ── Read sheet, check conflict, append ────────────────────────────────────
  try {
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1',
    });

    const rows = readRes.data.values || [];
    console.log('cirk/book: sheet rows count:', rows.length);

    if (rows.length === 0) {
      // Initialise headers on first use
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [CIRK_HEADERS] },
      });
      console.log('cirk/book: headers written');
    } else {
      // Check for duplicate booking
      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const slotIdx = headers.indexOf('slot_id');
      console.log('cirk/book: header row:', rows[0], '| slot_id col index:', slotIdx);
      if (slotIdx !== -1) {
        for (let i = 1; i < rows.length; i++) {
          if ((rows[i][slotIdx] || '').trim() === slot_id) {
            console.log('cirk/book: slot already taken:', slot_id);
            return res.status(409).json({ detail: 'Slot already booked' });
          }
        }
      }
    }

    // Append booking
    const ts   = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const slot = SLOTS_BY_ID[slot_id];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[slot_id, slot.date, slot.time, first_name.trim(), whatsapp.trim(), ts]],
      },
    });

    console.log('cirk/book: booked', slot_id, 'for', first_name);
    return res.status(200).json({ status: 'booked', slot_id, first_name: first_name.trim() });

  } catch (err) {
    console.error('cirk/book: sheets API error:', err.message);
    console.error('cirk/book: error code:', err.code, 'status:', err.status);
    if (err.response) {
      console.error('cirk/book: API response:', JSON.stringify(err.response.data));
    }
    return res.status(500).json({ detail: 'Booking failed: ' + err.message });
  }
};
