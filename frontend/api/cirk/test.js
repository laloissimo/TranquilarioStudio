const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const report = {
    env: {
      GOOGLE_SERVICE_ACCOUNT_JSON: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
      GOOGLE_CREDENTIALS:          !!process.env.GOOGLE_CREDENTIALS,
      CIRK_SHEET_ID:               process.env.CIRK_SHEET_ID || null,
    },
    credsJsonSource: null,
    credsParseOk:    false,
    credsParseError: null,
    clientEmail:     null,
    authInitOk:      false,
    authInitError:   null,
    sheetsReadOk:    false,
    sheetsReadError: null,
    sheetsRowCount:  null,
  };

  // Which env var has the credentials?
  const credsJson =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_CREDENTIALS || null;
  report.credsJsonSource = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? 'GOOGLE_SERVICE_ACCOUNT_JSON'
    : process.env.GOOGLE_CREDENTIALS
    ? 'GOOGLE_CREDENTIALS'
    : null;

  if (!credsJson) {
    return res.status(200).json(report);
  }

  // Parse credentials
  let creds;
  try {
    creds = JSON.parse(credsJson);
    report.credsParseOk = true;
    report.clientEmail  = creds.client_email || null;
  } catch (e) {
    report.credsParseError = e.message;
    return res.status(200).json(report);
  }

  // Init auth
  let auth;
  try {
    auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    // Force token fetch so auth errors surface here
    await auth.getClient();
    report.authInitOk = true;
  } catch (e) {
    report.authInitError = e.message;
    return res.status(200).json(report);
  }

  // Try reading the sheet
  if (!report.env.CIRK_SHEET_ID) {
    return res.status(200).json(report);
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: report.env.CIRK_SHEET_ID,
      range: 'Sheet1!A1:F5',
    });
    report.sheetsReadOk   = true;
    report.sheetsRowCount = (r.data.values || []).length;
  } catch (e) {
    report.sheetsReadError = e.message;
  }

  return res.status(200).json(report);
};
