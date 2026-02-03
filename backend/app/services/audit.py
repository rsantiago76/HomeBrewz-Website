from typing import Any, Dict, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app import models

class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log_action(
        self,
        *,
        action: str,
        entity_type: str,
        entity_id: str,
        actor_user_id: Optional[UUID],
        roaster_id: Optional[UUID] = None,
        changes: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> models.AuditLog:
        audit_log = models.AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            actor_user_id=actor_user_id,
            roaster_id=roaster_id, # Tenant context
            changes=changes,
            ip_address=ip_address
        )
        self.db.add(audit_log)
        # We don't commit here usually, letting the transaction manager handle it, 
        # but for audit logs sometimes needed immediately. 
        # For now, rely on main transaction.
        return audit_log
