from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, BusinessSnapshot, Risk
from models.schemas import CopilotRequest, CopilotReply
from services.ai_engine import copilot_plan

router = APIRouter(tags=["copilot"])

@router.post("/copilot/ask", response_model=CopilotReply)
def ask(body: CopilotRequest):
    db: Session = SessionLocal()
    try:
        snap = db.get(BusinessSnapshot, body.snapshot_id)
        if not snap:
            raise HTTPException(status_code=404, detail="Snapshot not found")
        risks = db.query(Risk).filter(Risk.snapshot_id == snap.id).all()
        context = {
            "snapshot": {
                "revenue_monthly": float(snap.revenue_monthly),
                "expenses_monthly": float(snap.expenses_monthly),
                "cash_on_hand": float(snap.cash_on_hand),
                "top_client_name": snap.top_client_name,
                "top_client_share": float(snap.top_client_share) if snap.top_client_share else None,
                "supplier_concentration": float(snap.supplier_concentration),
            },
            "risks": [
                {"title": r.title, "severity": r.severity, "priority": r.priority} for r in risks
            ],
        }
        answer = copilot_plan(context, body.question)
        return CopilotReply(answer=answer.strip())
    finally:
        db.close()
