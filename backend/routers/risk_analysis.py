from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, BusinessSnapshot, Risk
from models.schemas import RiskInDB
from services.ai_engine import analyze_risks

router = APIRouter(tags=["risk"])

@router.post("/risk/analyze", response_model=list[RiskInDB])
def analyze(snapshot_id: int):
    db: Session = SessionLocal()
    try:
        snap = db.get(BusinessSnapshot, snapshot_id)
        if not snap:
            raise HTTPException(status_code=404, detail="Snapshot not found")
        try:
            risks = analyze_risks({
            "revenue_monthly": float(snap.revenue_monthly),
            "expenses_monthly": float(snap.expenses_monthly),
            "cash_on_hand": float(snap.cash_on_hand),
            "top_client_name": snap.top_client_name,
            "top_client_share": float(snap.top_client_share) if snap.top_client_share is not None else None,
            "supplier_concentration": float(snap.supplier_concentration),
        })
            out = []
            for r in risks:
                row = Risk(
                    snapshot_id=snap.id,
                    title=r.get("title", "N/A"),
                    severity=int(r.get("severity", 0)),
                    priority=int(r.get("priority", 0)),
                    detail=r.get("detail", ""),
                    suggestion=r.get("suggestion", ""),
                )
                db.add(row)
                db.flush()
                out.append(row)
            db.commit()
            return [RiskInDB.from_orm(r) for r in out]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Risk analysis failed: {e}")
    finally:
        db.close()
