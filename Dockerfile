FROM python:3.11-slim

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /TaskManager

COPY requirements.txt .
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONUNBUFFERED=1

CMD ["python", "app.py"]
