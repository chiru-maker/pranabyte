# Windows PowerShell Script to Run Streamlit App
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Patient Story Engine (Streamlit)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $CurrentDir

C:\Users\chiru\AppData\Local\Programs\Python\Python311\python.exe -m streamlit run streamlit_app.py --server.port 8501
