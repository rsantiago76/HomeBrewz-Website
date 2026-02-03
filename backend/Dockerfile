FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# libpq-dev is needed for building psycopg2 (if used) or other pg drivers
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (App Runner typically uses 8080 by default, ensuring match)
EXPOSE 8000

# Run application
# Using 0.0.0.0 to bind to all interfaces valid for container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
