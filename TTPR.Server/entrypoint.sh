#!/bin/bash
set -e

echo "Waiting for SQL Server to be ready..."

until /opt/mssql-tools/bin/sqlcmd -S db -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &> /dev/null
do
  echo "SQL Server is unavailable - sleeping"
  sleep 5
done

echo "SQL Server is up - running migrations"

dotnet ef database update

echo "Starting server..."
dotnet TTPR.Server.dll