#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_USER=${DB_USER:-dhm}
DB_PASSWORD=${DB_PASSWORD:-dhm-demo-pass-2026}
DB_NAME=${DB_NAME:-dhm}

echo "=== DHM Credentials ==="
echo "URL Public: https://dhm.student-dev.ro"
echo ""
echo "=== Adminer (https://db.student-dev.ro) ==="
echo "System: PostgreSQL"
echo "Server: student-victor-db"
echo "Username: $DB_USER"
echo "Password: $DB_PASSWORD"
echo "Database: $DB_NAME"
