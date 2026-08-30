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

async function getBookings() {
  const auth = await getAuth();
  if (!auth) return {};

  const sheetId = await resolveSheetId(auth);
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1',
  });

  const rows = res.data.values || [];
  if (rows.length < 2) return {};

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const slotIdx = headers.indexOf('slot_id');
  const nameIdx = headers.indexOf('first_name');
  if (slotIdx === -1 || nameIdx === -1) return {};

  const booked = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const sid = (row[slotIdx] || '').trim();
    const name = (row[nameIdx] || '').trim();
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
    status: booked[slot.slot_id] ? 'booked' : 'available',
    first_name: booked[slot.slot_id] || null,
  }));

  return res.status(200).json(result);
};
