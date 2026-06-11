from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import json
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
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

mongo_url = os.environ.get('MONGO_URL')
if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'tranquilario')]
else:
    client = None
    db = None
    logger.warning("MONGO_URL not set — running in file-fallback-only mode")

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'tranquilario@pm.me')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# JSON fallback for when MongoDB is unavailable
FALLBACK_FILE = ROOT_DIR / 'contacts_fallback.json'
_fallback_lock = asyncio.Lock()


async def _save_to_fallback(doc: dict) -> None:
    async with _fallback_lock:
        existing = []
        if FALLBACK_FILE.exists():
            try:
                existing = json.loads(FALLBACK_FILE.read_text())
            except Exception:
                existing = []
        existing.append(doc)
        FALLBACK_FILE.write_text(json.dumps(existing, indent=2))
    logger.info("Contact saved to fallback file (MongoDB unavailable)")


async def _load_from_fallback() -> list:
    async with _fallback_lock:
        if not FALLBACK_FILE.exists():
            return []
        try:
            return json.loads(FALLBACK_FILE.read_text())
        except Exception:
            return []


app = FastAPI(title="Tranquilário Studio API")
api_router = APIRouter(prefix="/api")


def _build_contact_email_html(contact: 'Contact') -> str:
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


async def _send_contact_email(contact: 'Contact') -> Optional[str]:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping email send")
        return None
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
        logger.info(f"Resend: contact email sent (id={email_id})")
        return email_id
    except Exception as e:
        logger.error(f"Resend: failed to send contact email: {e}")
        return None


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


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Tranquilário Studio API — stillness and renewal."}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()

    saved_to_mongo = False
    if db is not None:
        try:
            await db.contacts.insert_one(doc)
            logger.info(f"New contact request from {contact.email} ({contact.language})")
            saved_to_mongo = True
        except Exception as e:
            logger.warning(f"MongoDB unavailable ({e}), falling back to local file")

    if not saved_to_mongo:
        try:
            await _save_to_fallback(doc)
        except Exception as e:
            logger.exception("Fallback file save failed")
            raise HTTPException(status_code=500, detail="Could not save contact")

    await _send_contact_email(contact)
    return contact


@api_router.get("/contacts", response_model=List[Contact])
async def list_contacts(limit: int = 100):
    items = []
    if db is not None:
        try:
            items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        except Exception as e:
            logger.warning(f"MongoDB unavailable ({e}), reading from fallback file")

    if not items:
        items = await _load_from_fallback()
        items = sorted(items, key=lambda x: x.get('created_at', ''), reverse=True)[:limit]

    for it in items:
        if isinstance(it.get('created_at'), str):
            try:
                it['created_at'] = datetime.fromisoformat(it['created_at'])
            except Exception:
                pass
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()
