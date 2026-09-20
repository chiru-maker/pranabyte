# Windows PowerShell Startup Script for Patient Story Engine Frontend
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Patient Story Engine Frontend" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$CurrentDir\frontend"

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies (including ogl for Plasma background)..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting Vite Development Server on http://localhost:3000..." -ForegroundColor Green
npm run dev
