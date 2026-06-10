FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements-render.txt .
RUN pip install --no-cache-dir -r requirements-render.txt

COPY backend/server.py .

CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
