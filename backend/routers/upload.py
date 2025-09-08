from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal, BusinessSnapshot
from models.schemas import UploadResult
from services.data_parser import parse_csv_and_summarize

router = APIRouter(tags=["upload"])

@router.post("/upload-csv", response_model=UploadResult)
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    contents = await file.read()
    summary = parse_csv_and_summarize(contents)
    db: Session = SessionLocal()
    try:
        snap = BusinessSnapshot(
            revenue_monthly=summary["revenue_monthly"],
            expenses_monthly=summary["expenses_monthly"],
            cash_on_hand=summary["cash_on_hand"],
            top_client_name=summary["top_client_name"],
            top_client_share=summary["top_client_share"],
            supplier_concentration=summary["supplier_concentration"],
            data_json=summary,
        )
        db.add(snap)
        db.commit()
        db.refresh(snap)
        return UploadResult(snapshot_id=snap.id)
    finally:
        db.close()
