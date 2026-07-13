const { Resend } = require('resend');
const { google } = require('googleapis');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'tranquilario2000@gmail.com';
const FEEDBACK_SHEET_ID = process.env.FEEDBACK_SHEET_ID || '15QBiiDaSvvefOLxGoxY2QzZYYhAVnWcGN-3md4LovGk';

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildFeedbackEmailHtml(data) {
  const reviewMap = { yes_named: 'Yes (with name)', yes_anon: 'Yes (anonymously)', no: 'No' };
  const mailingMap = { yes: 'Yes', no: 'No', already: 'Already subscribed' };
  const feelingsStr = Array.isArray(data.feelings) ? data.feelings.join(', ') : '—';
  const receivedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const rows = [
    ['Name', data.full_name],
    ['Profession', data.profession || '—'],
    ['Age', data.age || '—'],
    ['Language', data.language || 'en'],
    ['Rating', data.rating || '—'],
    ['Post-session feelings', feelingsStr],
    ['Review permission', reviewMap[data.review_permission] || data.review_permission || '—'],
    ['Mailing list', mailingMap[data.mailing_list] || data.mailing_list || '—'],
  ];

  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="padding:7px 14px;color:#5C605A;font-family:Manrope,Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;width:180px;vertical-align:top;border-bottom:1px solid rgba(74,93,78,0.08);">${esc(k)}</td>` +
        `<td style="padding:7px 14px;color:#2B2E2A;font-family:Manrope,Arial,sans-serif;font-size:13px;border-bottom:1px solid rgba(74,93,78,0.08);">${esc(v)}</td>` +
        `</tr>`
    )
    .join('');

  const safeComments = esc(data.comments || '').replace(/\n/g, '<br/>');

  return `
    <div style="background:#F4F1ED;padding:32px 0;font-family:Manrope,Arial,sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background:#ffffff;border:1px solid rgba(74,93,78,0.15);border-radius:20px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;background:#3A4A3E;color:#F4F1ED;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;letter-spacing:.01em;">Tranquilário Studio</div>
            <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7FA8A0;margin-top:6px;">Session feedback — ${esc(data.full_name)}</div>
            <div style="font-size:11px;color:#7FA8A0;margin-top:4px;">Received ${receivedAt}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">${rowHtml}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 28px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Comments</div>
            <div style="font-size:15px;color:#2B2E2A;line-height:1.6;background:#F4F1ED;border-left:3px solid #5E8B82;padding:16px 18px;border-radius:8px;">${safeComments}</div>
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
  const feelingsStr = Array.isArray(data.feelings) ? data.feelings.join(', ') : '';

  const row = [
    ts,
    data.full_name || '',
    data.profession || '',
    data.age || '',
    data.rating || '',
    feelingsStr,
    data.comments || '',
    data.review_permission || '',
    data.mailing_list || '',
    data.language || 'en',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: FEEDBACK_SHEET_ID,
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

  if (!data.full_name || !data.comments) {
    return res.status(422).json({ detail: 'full_name and comments are required' });
  }

  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: `Tranquilário Studio <${SENDER_EMAIL}>`,
      to: [RECIPIENT_EMAIL],
      subject: `Session feedback — ${data.full_name}`,
      html: buildFeedbackEmailHtml(data),
    });
  }

  try {
    await appendToSheet(data);
  } catch (err) {
    console.error('Sheets append failed:', err.message);
  }

  return res.status(200).json({ status: 'received' });
};
