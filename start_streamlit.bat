@echo off
title Patient Story Engine - Streamlit App
cd /d "%~dp0"
echo ==========================================
echo Starting Patient Story Engine (Streamlit)
echo ==========================================
C:\Users\chiru\AppData\Local\Programs\Python\Python311\python.exe -m streamlit run streamlit_app.py --server.port 8501
pause
