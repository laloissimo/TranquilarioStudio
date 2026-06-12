from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import asyncio
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import Optional
import uuid
from datetime import datetime, timezone
from html import escape


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'tranquilario2000@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
else:
    logger.warning("RESEND_API_KEY not set — emails will be skipped")

app = FastAPI(title="Tranquilário Studio API")
api_router = APIRouter(prefix="/api")


# ----- Models -----
class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    preferred_session: Optional[str] = Field(default=None, max_length=60)
    referral_source: Optional[str] = Field(default=None, max_length=60)
    referral_other: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=2000)
    language: Optional[str] = Field(default="en", max_length=8)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    preferred_session: Optional[str] = None
    referral_source: Optional[str] = None
    referral_other: Optional[str] = None
    message: str
    language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IntakeCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str = Field(min_length=1, max_length=120)
    birthday: Optional[str] = Field(default=None, max_length=20)
    age: Optional[str] = Field(default=None, max_length=10)
    phone: Optional[str] = Field(default=None, max_length=40)
    email: Optional[EmailStr] = None
    heart_disease: bool = False
    high_blood_pressure: bool = False
    varicose_veins: bool = False
    pregnant: bool = False
    recent_injuries: Optional[str] = Field(default=None, max_length=2000)
    other_complaints: Optional[str] = Field(default=None, max_length=2000)
    client_name: Optional[str] = Field(default=None, max_length=120)
    submission_date: Optional[str] = Field(default=None, max_length=20)
    signature: Optional[str] = None  # base64 data URL from canvas
    language: Optional[str] = Field(default="en", max_length=8)

    @field_validator('email', mode='before')
    @classmethod
    def empty_email_to_none(cls, v):
        return None if v == '' else v


class FeedbackCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    rating: Optional[str] = Field(default=None, max_length=60)
    feelings: Optional[list] = None
    comments: str = Field(min_length=1, max_length=4000)
    review_permission: Optional[str] = Field(default=None, max_length=20)
    full_name: str = Field(min_length=1, max_length=120)
    profession: Optional[str] = Field(default=None, max_length=120)
    age: Optional[str] = Field(default=None, max_length=10)
    mailing_list: Optional[str] = Field(default=None, max_length=20)
    language: Optional[str] = Field(default="en", max_length=8)


# ----- Email builders -----
def _build_contact_email_html(contact: Contact) -> str:
    referral = contact.referral_source or "—"
    if contact.referral_other:
        referral = f"{referral} ({contact.referral_other})"
    rows = [
        ("Name", contact.name),
        ("Email", contact.email),
        ("Phone", contact.phone or "—"),
        ("Preferred session", contact.preferred_session or "—"),
        ("Heard about Lalo via", referral),
        ("Language", contact.language),
        ("Received", contact.created_at.strftime("%Y-%m-%d %H:%M UTC")),
    ]
    row_html = "".join(
        f'<tr><td style="padding:8px 14px;color:#5C605A;font-family:Manrope,Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:.12em;width:160px;vertical-align:top;">{escape(str(k))}</td>'
        f'<td style="padding:8px 14px;color:#2B2E2A;font-family:Manrope,Arial,sans-serif;font-size:14px;">{escape(str(v))}</td></tr>'
        for k, v in rows
    )
    safe_msg = escape(contact.message).replace("\n", "<br/>")
    return f"""
    <div style="background:#F4F1ED;padding:32px 0;font-family:Manrope,Arial,sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background:#ffffff;border:1px solid rgba(74,93,78,0.15);border-radius:20px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;background:#3A4A3E;color:#F4F1ED;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;letter-spacing:.01em;">Tranquilário Studio</div>
            <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7FA8A0;margin-top:6px;">New session request</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">{row_html}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 28px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Message</div>
            <div style="font-size:15px;color:#2B2E2A;line-height:1.6;background:#F4F1ED;border-left:3px solid #5E8B82;padding:16px 18px;border-radius:8px;">{safe_msg}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 32px 24px;font-size:12px;color:#5C605A;border-top:1px solid rgba(74,93,78,0.12);">
            Reply directly to <a href="mailto:{escape(contact.email)}" style="color:#4A5D4E;">{escape(contact.email)}</a> to respond to this request.
          </td>
        </tr>
      </table>
    </div>
    """


def _build_intake_email_html(intake: IntakeCreate) -> str:
    def yesno(val: bool) -> str:
        return "Yes" if val else "No"

    personal_rows = [
        ("Full name", intake.full_name),
        ("Date of birth", intake.birthday or "—"),
        ("Age", intake.age or "—"),
        ("Phone / WhatsApp", intake.phone or "—"),
        ("Email", intake.email or "—"),
        ("Language", intake.language or "en"),
        ("Submission date", intake.submission_date or "—"),
    ]

    health_rows = [
        ("Heart disease", yesno(intake.heart_disease)),
        ("High blood pressure", yesno(intake.high_blood_pressure)),
        ("Varicose veins", yesno(intake.varicose_veins)),
        ("Pregnant", yesno(intake.pregnant)),
        ("Recent injuries / surgeries", escape(intake.recent_injuries or "—")),
        ("Other complaints", escape(intake.other_complaints or "—")),
    ]

    def rows_html(rows):
        return "".join(
            f'<tr>'
            f'<td style="padding:7px 14px;color:#5C605A;font-family:Manrope,Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;width:180px;vertical-align:top;border-bottom:1px solid rgba(74,93,78,0.08);">{escape(str(k))}</td>'
            f'<td style="padding:7px 14px;color:#2B2E2A;font-family:Manrope,Arial,sans-serif;font-size:13px;border-bottom:1px solid rgba(74,93,78,0.08);">{str(v)}</td>'
            f'</tr>'
            for k, v in rows
        )

    received_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    safe_email = escape(str(intake.email)) if intake.email else ""
    reply_cell = (
        'Reply to client: <a href="mailto:' + safe_email + '" style="color:#4A5D4E;">' + safe_email + '</a>'
        if intake.email else "No email provided."
    )

    return f"""
    <div style="background:#F4F1ED;padding:32px 0;font-family:Manrope,Arial,sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="margin:0 auto;background:#ffffff;border:1px solid rgba(74,93,78,0.15);border-radius:20px;overflow:hidden;">

        <tr>
          <td style="padding:28px 32px;background:#3A4A3E;color:#F4F1ED;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;letter-spacing:.01em;">Tranquilário Studio</div>
            <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7FA8A0;margin-top:6px;">New client intake form — {escape(intake.full_name)}</div>
            <div style="font-size:11px;color:#7FA8A0;margin-top:4px;">Received {received_at}</div>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Personal Information</div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">{rows_html(personal_rows)}</table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Health &amp; Medical History</div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">{rows_html(health_rows)}</table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Consent</div>
            <div style="font-size:13px;color:#4A5D4E;background:#F4F1ED;border-left:3px solid #5E8B82;padding:14px 18px;border-radius:8px;">
              All seven consent statements agreed ✓<br/>
              <span style="font-size:11px;color:#5C605A;">Signed by: {escape(intake.client_name or intake.full_name)} — {escape(intake.submission_date or "—")}</span>
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
            {reply_cell}
          </td>
        </tr>

      </table>
    </div>
    """


def _build_feedback_email_html(fb: FeedbackCreate) -> str:
    review_map = {'yes_named': 'Yes (with name)', 'yes_anon': 'Yes (anonymously)', 'no': 'No'}
    mailing_map = {'yes': 'Yes', 'no': 'No', 'already': 'Already subscribed'}
    feelings_str = ', '.join(fb.feelings) if fb.feelings else '—'
    rows = [
        ("Name", fb.full_name),
        ("Profession", fb.profession or "—"),
        ("Age", fb.age or "—"),
        ("Language", fb.language or "en"),
        ("Rating", fb.rating or "—"),
        ("Post-session feelings", feelings_str),
        ("Review permission", review_map.get(fb.review_permission or '', fb.review_permission or '—')),
        ("Mailing list", mailing_map.get(fb.mailing_list or '', fb.mailing_list or '—')),
    ]
    row_html = "".join(
        f'<tr>'
        f'<td style="padding:7px 14px;color:#5C605A;font-family:Manrope,Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.12em;width:180px;vertical-align:top;border-bottom:1px solid rgba(74,93,78,0.08);">{escape(str(k))}</td>'
        f'<td style="padding:7px 14px;color:#2B2E2A;font-family:Manrope,Arial,sans-serif;font-size:13px;border-bottom:1px solid rgba(74,93,78,0.08);">{escape(str(v))}</td>'
        f'</tr>'
        for k, v in rows
    )
    safe_comments = escape(fb.comments).replace("\n", "<br/>")
    received_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    return f"""
    <div style="background:#F4F1ED;padding:32px 0;font-family:Manrope,Arial,sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background:#ffffff;border:1px solid rgba(74,93,78,0.15);border-radius:20px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px;background:#3A4A3E;color:#F4F1ED;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:300;letter-spacing:.01em;">Tranquilário Studio</div>
            <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7FA8A0;margin-top:6px;">Session feedback — {escape(fb.full_name)}</div>
            <div style="font-size:11px;color:#7FA8A0;margin-top:4px;">Received {received_at}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">{row_html}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 28px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#5E8B82;margin-bottom:10px;">Comments</div>
            <div style="font-size:15px;color:#2B2E2A;line-height:1.6;background:#F4F1ED;border-left:3px solid #5E8B82;padding:16px 18px;border-radius:8px;">{safe_comments}</div>
          </td>
        </tr>
      </table>
    </div>
    """


# ----- Email senders -----
async def _send_contact_email(contact: Contact) -> None:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping email send")
        return
    params = {
        "from": f"Tranquilário Studio <{SENDER_EMAIL}>",
        "to": [RECIPIENT_EMAIL],
        "reply_to": contact.email,
        "subject": f"New session request — {contact.name}",
        "html": _build_contact_email_html(contact),
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        email_id = email.get("id") if isinstance(email, dict) else None
        logger.info(f"Resend: email sent to {RECIPIENT_EMAIL} (id={email_id})")
    except Exception as e:
        logger.error(f"Resend: failed to send email: {e}")


async def _send_intake_email(intake: IntakeCreate) -> None:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping intake email")
        return

    # Extract base64 content from data URL for attachment
    sig_b64 = None
    if intake.signature and "," in intake.signature:
        sig_b64 = intake.signature.split(",", 1)[1]

    reply_to = str(intake.email) if intake.email else None
    params = {
        "from": f"Tranquilário Studio <{SENDER_EMAIL}>",
        "to": [RECIPIENT_EMAIL],
        "subject": f"New intake form — {intake.full_name}",
        "html": _build_intake_email_html(intake),
    }
    if reply_to:
        params["reply_to"] = reply_to
    if sig_b64:
        params["attachments"] = [{"filename": "signature.png", "content": sig_b64}]

    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        email_id = email.get("id") if isinstance(email, dict) else None
        logger.info(f"Resend: intake email sent for {intake.full_name} (id={email_id})")
    except Exception as e:
        logger.error(f"Resend: failed to send intake email: {e}")


async def _send_feedback_email(fb: FeedbackCreate) -> None:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping feedback email")
        return
    params = {
        "from": f"Tranquilário Studio <{SENDER_EMAIL}>",
        "to": [RECIPIENT_EMAIL],
        "subject": f"Session feedback — {fb.full_name}",
        "html": _build_feedback_email_html(fb),
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        email_id = email.get("id") if isinstance(email, dict) else None
        logger.info(f"Resend: feedback email sent for {fb.full_name} (id={email_id})")
    except Exception as e:
        logger.error(f"Resend: failed to send feedback email: {e}")


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Tranquilário Studio API — stillness and renewal."}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.get("/routes")
async def list_routes():
    return {
        "routes": [
            {"method": m, "path": r.path}
            for r in app.routes
            for m in getattr(r, "methods", [])
        ]
    }


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    logger.info(f"New contact request from {contact.email} ({contact.language})")
    await _send_contact_email(contact)
    return contact


@api_router.post("/feedback")
async def create_feedback(payload: FeedbackCreate):
    logger.info(f"New feedback from {payload.full_name} ({payload.language})")
    await _send_feedback_email(payload)
    return {"status": "received"}


@api_router.post("/intake")
async def create_intake(payload: IntakeCreate):
    logger.info(f"New intake form from {payload.full_name} ({payload.language})")
    await _send_intake_email(payload)
    return {"status": "received"}


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
async def log_registered_routes():
    logger.info("=== Registered routes ===")
    for route in app.routes:
        methods = sorted(getattr(route, "methods", None) or [])
        path = getattr(route, "path", repr(route))
        if methods:
            logger.info(f"  {', '.join(methods):8s}  {path}")
    logger.info("=========================")
