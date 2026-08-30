const { google } = require('googleapis');

// One-shot reset endpoint — delete this file after use.
// Call as: /api/cirk/reset?token=clearCirkNow2026

const SECRET = 'clearCirkNow2026';

module.exports = async function handler(req, res) {
  if (req.query.token !== SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_CREDENTIALS;
  const sheetId   = process.env.CIRK_SHEET_ID;

  if (!credsJson || !sheetId) {
    return res.status(503).json({ error: 'Missing credentials or CIRK_SHEET_ID' });
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credsJson),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Read current data to find how many rows exist
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1',
  });
  const rows = readRes.data.values || [];

  if (rows.length <= 1) {
    return res.status(200).json({ message: 'Nothing to clear — sheet already has only the header (or is empty).', rows: rows.length });
  }

  // Clear everything from row 2 downward, keep row 1 (header)
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:Z1000',
  });

  return res.status(200).json({
    message: `Cleared ${rows.length - 1} booking row(s). Header row preserved. All 16 slots are now available.`,
    rowsDeleted: rows.length - 1,
  });
};
