"""Backend API tests for Tranquilário Studio."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://lalo-wellness.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
def test_health(api_client):
    r = api_client.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_root(api_client):
    r = api_client.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    assert "message" in r.json()


# ---- Contact create + persistence ----
class TestContact:
    def test_create_contact_valid(self, api_client):
        payload = {
            "name": "TEST_User Wellness",
            "email": "test_user@example.com",
            "phone": "+49 170 0000000",
            "preferred_session": "thai",
            "message": "TEST_message please book a session",
            "language": "de",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert data["language"] == "de"
        assert "created_at" in data
        assert "_id" not in data

        # Verify persistence via GET
        r2 = api_client.get(f"{BASE_URL}/api/contacts", timeout=15)
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        assert any(it.get("id") == data["id"] for it in items)
        # No mongo _id leak
        for it in items:
            assert "_id" not in it

    def test_create_contact_invalid_email(self, api_client):
        payload = {"name": "TEST_x", "email": "not-an-email", "message": "hi"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_contact_missing_name(self, api_client):
        payload = {"email": "ok@example.com", "message": "hi"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_contact_missing_message(self, api_client):
        payload = {"name": "x", "email": "ok@example.com"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_contact_empty_name(self, api_client):
        payload = {"name": "", "email": "ok@example.com", "message": "hi"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contacts_sorted_desc(self, api_client):
        # create two new contacts and ensure latest first
        a = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": "TEST_A", "email": "a@example.com", "message": "first"},
            timeout=15,
        ).json()
        b = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": "TEST_B", "email": "b@example.com", "message": "second"},
            timeout=15,
        ).json()
        items = api_client.get(f"{BASE_URL}/api/contacts", timeout=15).json()
        ids = [it["id"] for it in items]
        # Newer (b) should appear before older (a)
        assert ids.index(b["id"]) < ids.index(a["id"])
