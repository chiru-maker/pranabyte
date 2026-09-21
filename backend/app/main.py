import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routers import (
    auth, patients, visits, documents, clinical_facts, doctor, fhir, audit
)

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pranabyte Clinical Intelligence Platform API",
    description="Evidence-linked clinical case-taking system with contradiction detection, timeline reconstruction & adaptive questioning.",
    version="1.0.0"
)

# Comprehensive Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Strict Transport Security (HSTS)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    
    # Prevent MIME-sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # Clickjacking Protection (Frame Ancestors)
    response.headers["X-Frame-Options"] = "DENY"
    
    # Referrer Policy
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # Permissions Policy (Permit microphone for speech-to-text intake)
    response.headers["Permissions-Policy"] = "camera=(), microphone=(self), geolocation=()"
    
    # Content Security Policy (Compatible with Fonts & Web Speech API)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "img-src 'self' data: blob: https://*; "
        "connect-src 'self' http://localhost:* ws://localhost:* https://*; "
        "frame-ancestors 'none';"
    )
    
    return response

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(patients.router, prefix=settings.API_V1_STR)
app.include_router(visits.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(clinical_facts.router, prefix=settings.API_V1_STR)
app.include_router(doctor.router, prefix=settings.API_V1_STR)
app.include_router(fhir.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": "Pranabyte Clinical Intelligence Platform",
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
