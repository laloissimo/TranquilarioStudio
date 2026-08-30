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

async function getAuth() {
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credsJson) return null;
  const creds = JSON.parse(credsJson);
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  });
}

async function resolveSheetId(auth) {
  if (process.env.CIRK_SHEET_ID) return process.env.CIRK_SHEET_ID;
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: "name='CirkFantastik2026' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: 'files(id)',
    pageSize: 1,
  });
  const files = res.data.files || [];
  if (!files.length) throw new Error('CirkFantastik2026 sheet not found');
  return files[0].id;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slot_id, first_name, whatsapp } = req.body || {};

  if (!slot_id || !first_name || !whatsapp) {
    return res.status(422).json({ detail: 'slot_id, first_name and whatsapp are required' });
  }
  if (!VALID_SLOT_IDS.has(slot_id)) {
    return res.status(400).json({ detail: 'Invalid slot_id' });
  }

  const auth = await getAuth();
  if (!auth) {
    return res.status(503).json({ detail: 'Booking service unavailable' });
  }

  let sheetId;
  try {
    sheetId = await resolveSheetId(auth);
  } catch (err) {
    console.error('cirk/book: resolveSheetId failed:', err.message);
    return res.status(503).json({ detail: 'Sheet not found — contact us directly' });
  }

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Read existing rows to check for conflicts and initialise headers
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1',
    });

    const rows = readRes.data.values || [];

    // Write headers if sheet is empty
    if (rows.length === 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [CIRK_HEADERS] },
      });
    } else {
      // Check for duplicate booking
      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const slotIdx = headers.indexOf('slot_id');
      if (slotIdx !== -1) {
        for (let i = 1; i < rows.length; i++) {
          if ((rows[i][slotIdx] || '').trim() === slot_id) {
            return res.status(409).json({ detail: 'Slot already booked' });
          }
        }
      }
    }

    // Append booking row
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const slot = SLOTS_BY_ID[slot_id];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[slot_id, slot.date, slot.time, first_name.trim(), whatsapp.trim(), ts]],
      },
    });

    console.log(`cirk/book: booked ${slot_id} for ${first_name}`);
    return res.status(200).json({ status: 'booked', slot_id, first_name: first_name.trim() });
  } catch (err) {
    if (err.status === 409) throw err;
    console.error('cirk/book: sheets error:', err.message);
    return res.status(500).json({ detail: 'Booking failed' });
  }
};
