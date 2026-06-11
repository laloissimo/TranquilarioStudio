# bullseye for Atlas SSL compatibility
FROM python:3.11-slim-bullseye

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements-render.txt .
RUN pip install --no-cache-dir -r requirements-render.txt

COPY server.py .

CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
