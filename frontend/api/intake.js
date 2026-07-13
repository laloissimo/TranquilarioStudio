const { Resend } = require('resend');
const { google } = require('googleapis');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'tranquilario2000@gmail.com';
const INTAKE_SHEET_ID = process.env.INTAKE_SHEET_ID || '1JRu7zWzCjOjGv2Tt6MzM-BlghJDHxwJ9mzMctbwzPa8';

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildIntakeEmailHtml(data) {
  const yesno = (v) => (v ? 'Yes' : 'No');
  const receivedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const personalRows = [
    ['Full name', data.full_name],
    ['Date of birth', data.birthday || '—'],
    ['Age', data.age || '—'],
    ['Phone / WhatsApp', data.phone || '—'],
    ['Email', data.email || '—'],
    ['Language', data.language || 'en'],
    ['Submission date', data.submission_date || '—'],
  ];

  const healthRows = [
    ['Heart disease', yesno(data.heart_disease)],
    ['High blood pressure', yesno(data.high_blood_pressure)],
    ['Varicose veins', yesno(data.varicose_veins)],
    ['Pregnant', yesno(data.pregnant)],
    ['Recent injuries / surgeries', esc(data.recent_injuries || '—')],
    ['Other complaints', esc(data.other_complaints || '—')],
  ];

  const rowsHtml = (rows) =>
    rows
      .map(
        ([k, v]) =>
          `<tr>` +
          `<td style="padding:7px 14px;color:#5C605A;font-family:Manrope,Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;width:180px;vertical-align:top;border-bottom:1px solid rgba(74,93,78,0.08);">${esc(k)}</td>` +
          `<td style="padding:7px 14px;color:#2B2E2A;font-family:Manrope,Arial,sans-serif;font-size:13px;border-bottom:1px solid rgba(74,93,78,0.08);">${v}</td>` +
          `</tr>`
      )
      .join('');

  const safeEmail = data.email ? esc(data.email) : '';
  const replyCell = data.email
    ? `Reply to client: <a href="mailto:${safeEmail}" style="color:#4A5D4E;">${safeEmail}</a>`
    : 'No email provided.';

  const signerName = esc(data.client_name || data.full_name || '');
  const sigDate = esc(data.submission_date || '—');

  return `
    <div style="background:#F4F1ED;padding:32px 0;font-family:Manrope,Arial,sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="margin:0 auto;background:#ffffff;border:1px solid rgba(74,93,78,0.15);border-radius:20px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;background:#3A4A3E;color:#F4F1ED;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;letter-spacing:.01em;">Tranquilário Studio</div>
            <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7FA8A0;margin-top:6px;">New client intake form — ${esc(data.full_name)}</div>
            <div style="font-size:11px;color:#7FA8A0;margin-top:4px;">Received ${receivedAt}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Personal Information</div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">${rowsHtml(personalRows)}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Health &amp; Medical History</div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">${rowsHtml(healthRows)}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Consent</div>
            <div style="font-size:13px;color:#4A5D4E;background:#F4F1ED;border-left:3px solid #5E8B82;padding:14px 18px;border-radius:8px;">
              All seven consent statements agreed ✓<br/>
              <span style="font-size:11px;color:#5C605A;">Signed by: ${signerName} — ${sigDate}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 28px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:12px;">Signature</div>
            <div style="font-size:12px;color:#5C605A;">See attached file: signature.png</div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 32px 20px;font-size:11px;color:#5C605A;border-top:1px solid rgba(74,93,78,0.12);">
            ${replyCell}
          </td>
        </tr>
      </table>
    </div>`;
}

async function appendToSheet(data) {
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credsJson) return;

  const creds = JSON.parse(credsJson);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const row = [
    ts,
    data.full_name || '',
    data.birthday || '',
    data.age || '',
    data.phone || '',
    data.email || '',
    '',
    data.heart_disease ? 'Yes' : 'No',
    data.high_blood_pressure ? 'Yes' : 'No',
    data.varicose_veins ? 'Yes' : 'No',
    data.pregnant ? 'Yes' : 'No',
    data.recent_injuries || '',
    data.other_complaints || '',
    '',
    '',
    data.client_name || '',
    data.submission_date || '',
    '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: INTAKE_SHEET_ID,
    range: 'Sheet1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data.full_name) {
    return res.status(422).json({ detail: 'full_name is required' });
  }

  // Send email (non-blocking on sheets)
  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY);
    const params = {
      from: `Tranquilário Studio <${SENDER_EMAIL}>`,
      to: [RECIPIENT_EMAIL],
      subject: `New intake form — ${data.full_name}`,
      html: buildIntakeEmailHtml(data),
    };
    if (data.email) params.reply_to = data.email;
    if (data.signature && data.signature.includes(',')) {
      const b64 = data.signature.split(',')[1];
      params.attachments = [{ filename: 'signature.png', content: Buffer.from(b64, 'base64') }];
    }
    await resend.emails.send(params);
  }

  // Sheets append (best-effort)
  try {
    await appendToSheet(data);
  } catch (err) {
    console.error('Sheets append failed:', err.message);
  }

  return res.status(200).json({ status: 'received' });
};
