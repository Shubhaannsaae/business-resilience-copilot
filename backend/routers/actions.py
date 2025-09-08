from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, BusinessSnapshot, Risk, ActionItem
from models.schemas import ActionItemInDB
from services.recommender import generate_actions

router = APIRouter(tags=["actions"])

@router.post("/actions/generate", response_model=list[ActionItemInDB])
def generate(snapshot_id: int):
    db: Session = SessionLocal()
    try:
        snap = db.get(BusinessSnapshot, snapshot_id)
        if not snap:
            raise HTTPException(status_code=404, detail="Snapshot not found")
        risks = db.query(Risk).filter(Risk.snapshot_id == snap.id).all()
        snapshot_dict = {
            "revenue_monthly": float(snap.revenue_monthly),
            "expenses_monthly": float(snap.expenses_monthly),
            "cash_on_hand": float(snap.cash_on_hand),
            "top_client_name": snap.top_client_name,
            "top_client_share": float(snap.top_client_share) if snap.top_client_share else None,
            "supplier_concentration": float(snap.supplier_concentration),
        }
        risk_dicts = [{"title": r.title, "severity": r.severity, "priority": r.priority} for r in risks]
        actions = generate_actions(snapshot_dict, risk_dicts)
        out = []
        for a in actions:
            row = ActionItem(
                snapshot_id=snap.id,
                title=a["title"],
                description=a["description"],
                impact=int(a.get("impact", 0)),
                effort=int(a.get("effort", 0)),
                due_days=int(a.get("due_days", 0)),
            )
            db.add(row)
            db.flush()
            db.refresh(row)
            out.append(ActionItemInDB.model_validate(row))
        db.commit()
        return out
    finally:
        db.close()
