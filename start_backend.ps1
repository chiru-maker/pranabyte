# Windows PowerShell Startup Script for Patient Story Engine Backend
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Patient Story Engine Backend API" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $CurrentDir

# Check Python virtual environment
if (-Not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Green
& ".\venv\Scripts\Activate.ps1"

Write-Host "Installing/Verifying dependencies..." -ForegroundColor Yellow
pip install -r backend\requirements.txt

Write-Host "Seeding demo clinical data..." -ForegroundColor Green
python backend\seed_data.py

Write-Host "Starting FastAPI Server on http://127.0.0.1:8000..." -ForegroundColor Cyan
Write-Host "API Documentation available at http://127.0.0.1:8000/docs" -ForegroundColor Green
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
