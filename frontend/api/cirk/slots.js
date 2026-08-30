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

function getCredsJson() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_CREDENTIALS || null;
}

async function getBookings() {
  const credsJson = getCredsJson();
  const sheetId   = process.env.CIRK_SHEET_ID;

  if (!credsJson || !sheetId) {
    console.warn('cirk/slots: missing credentials or CIRK_SHEET_ID — returning all available');
    return {};
  }

  const creds = JSON.parse(credsJson);
  const auth  = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1',
  });

  const rows = res.data.values || [];
  if (rows.length < 2) return {};

  const headers  = rows[0].map((h) => h.toLowerCase().trim());
  const slotIdx  = headers.indexOf('slot_id');
  const nameIdx  = headers.indexOf('first_name');
  if (slotIdx === -1 || nameIdx === -1) return {};

  const booked = {};
  for (let i = 1; i < rows.length; i++) {
    const sid  = (rows[i][slotIdx] || '').trim();
    const name = (rows[i][nameIdx] || '').trim();
    if (sid && name) booked[sid] = name;
  }
  return booked;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  let booked = {};
  try {
    booked = await getBookings();
  } catch (err) {
    console.error('cirk/slots: sheet read failed:', err.message);
  }

  const result = CIRK_SLOTS.map((slot) => ({
    ...slot,
    status:     booked[slot.slot_id] ? 'booked' : 'available',
    first_name: booked[slot.slot_id] || null,
  }));

  return res.status(200).json(result);
};
