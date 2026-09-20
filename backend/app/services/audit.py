from typing import Optional
from sqlalchemy.orm import Session
from backend.app.models import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        actor_name: str,
        actor_role: str,
        action: str,
        patient_id: Optional[str] = None,
        visit_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = "127.0.0.1"
    ) -> AuditLog:
        log = AuditLog(
            patient_id=patient_id,
            visit_id=visit_id,
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=action,
            details=details,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

audit_service = AuditService()
