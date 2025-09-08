from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, BusinessSnapshot
from models.schemas import SimulationRequest, SimulationResult

router = APIRouter(tags=["simulation"])

@router.post("/simulation/run", response_model=SimulationResult)
def simulate(body: SimulationRequest):
    db: Session = SessionLocal()
    try:
        snap = db.get(BusinessSnapshot, body.snapshot_id)
        if not snap:
            raise HTTPException(status_code=404, detail="Snapshot not found")

        rev = float(snap.revenue_monthly)
        exp = float(snap.expenses_monthly)
        notes = []

        rev *= (1.0 + body.sales_change_pct / 100.0)
        exp *= (1.0 + body.expense_change_pct / 100.0)

        if body.lose_top_client and snap.top_client_share:
            rev *= (1.0 - float(snap.top_client_share))
            notes.append("Lost top client revenue share applied")

        if body.supplier_failure_weeks > 0:
            # model supply delay as temporary 10% revenue impact per 4 weeks
            impact = 0.10 * (body.supplier_failure_weeks / 4.0)
            rev *= max(0.0, 1.0 - impact)
            notes.append(f"Supplier disruption impact {impact:.0%}")

        net_burn = exp - rev
        if net_burn <= 0:
            runway = 120.0  # effectively sustainable
            notes.append("Non-negative cash flow; capped runway at 120 months")
        else:
            runway = float(snap.cash_on_hand) / max(1e-6, net_burn)

        return SimulationResult(
            revenue_monthly=round(rev, 2),
            expenses_monthly=round(exp, 2),
            runway_months=round(runway, 2),
            notes=notes or ["Baseline simulation"],
        )
    finally:
        db.close()
