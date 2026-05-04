from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Tranquilário Studio API")
api_router = APIRouter(prefix="/api")


# ----- Models -----
class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    preferred_session: Optional[str] = Field(default=None, max_length=60)
    message: str = Field(min_length=1, max_length=2000)
    language: Optional[str] = Field(default="en", max_length=8)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    preferred_session: Optional[str] = None
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
    try:
        contact = Contact(**payload.model_dump())
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.contacts.insert_one(doc)
        logger.info(f"New contact request from {contact.email} ({contact.language})")
        return contact
    except Exception as e:
        logger.exception("Failed to save contact")
        raise HTTPException(status_code=500, detail=f"Could not save contact: {e}")


@api_router.get("/contacts", response_model=List[Contact])
async def list_contacts(limit: int = 100):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
