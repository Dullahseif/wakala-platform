from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import FraudAlert, Transaction, Agent
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])

class FraudAlertCreate(BaseModel):
    agent_id: str
    alert_type: str
    description: str
    amount: float
    risk_level: str
    provider: str

@router.get("/")
def get_all_alerts(db: Session = Depends(get_db)):
    alerts = db.query(FraudAlert).order_by(FraudAlert.created_at.desc()).all()
    return {"alerts": alerts, "total": len(alerts)}

@router.get("/{alert_id}")
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/")
def create_alert(alert: FraudAlertCreate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == alert.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    new_alert = FraudAlert(
        id=f"FRD-{str(uuid.uuid4())[:6].upper()}",
        agent_id=alert.agent_id,
        agent_name=agent.name,
        alert_type=alert.alert_type,
        description=alert.description,
        amount=alert.amount,
        risk_level=alert.risk_level,
        status="open",
        provider=alert.provider
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"message": "Fraud alert created", "alert": new_alert}

@router.put("/{alert_id}/investigate")
def investigate_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "investigating"
    db.commit()
    return {"message": "Alert marked as investigating", "alert": alert}

@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "resolved"
    db.commit()
    return {"message": "Alert resolved", "alert": alert}

@router.post("/scan/{agent_id}")
def scan_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    alerts_created = []
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)

    recent_transactions = db.query(Transaction).filter(
        Transaction.agent_id == agent_id,
        Transaction.created_at >= one_hour_ago
    ).all()

    if len(recent_transactions) > 10:
        alert = FraudAlert(
            id=f"FRD-{str(uuid.uuid4())[:6].upper()}",
            agent_id=agent_id,
            agent_name=agent.name,
            alert_type="Unusual Spike",
            description=f"{len(recent_transactions)} transactions in the last hour",
            amount=sum(t.amount for t in recent_transactions),
            risk_level="Critical",
            status="open",
            provider=recent_transactions[0].provider if recent_transactions else "unknown"
        )
        db.add(alert)
        db.commit()
        alerts_created.append("Unusual transaction spike detected")

    return {
        "message": f"Scan complete. {len(alerts_created)} alerts created.",
        "alerts": alerts_created
    }