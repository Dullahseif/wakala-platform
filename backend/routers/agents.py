from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Agent
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/agents", tags=["Agents"])

class AgentCreate(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    provider: str
    national_id: str

class AgentUpdate(BaseModel):
    status: Optional[str] = None
    float_balance: Optional[float] = None
    location: Optional[str] = None

@router.get("/")
def get_all_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    return {"agents": agents, "total": len(agents)}

@router.get("/{agent_id}")
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.post("/")
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    existing = db.query(Agent).filter(
        (Agent.email == agent.email) |
        (Agent.phone == agent.phone) |
        (Agent.national_id == agent.national_id)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Agent already exists")
    new_agent = Agent(
        id=f"WK-{str(uuid.uuid4())[:6].upper()}",
        name=agent.name,
        email=agent.email,
        phone=agent.phone,
        location=agent.location,
        provider=agent.provider,
        national_id=agent.national_id,
        status="active",
        credit_score=0,
        float_balance=0.0
    )
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    return {"message": "Agent created successfully", "agent": new_agent}

@router.put("/{agent_id}")
def update_agent(agent_id: str, update: AgentUpdate, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if update.status:
        agent.status = update.status
    if update.float_balance is not None:
        agent.float_balance = update.float_balance
    if update.location:
        agent.location = update.location
    db.commit()
    db.refresh(agent)
    return {"message": "Agent updated successfully", "agent": agent}

@router.delete("/{agent_id}")
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return {"message": "Agent deleted successfully"}