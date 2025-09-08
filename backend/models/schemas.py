from pydantic import BaseModel, Field, conint, confloat
from typing import List, Optional, Dict, Any

class UploadResult(BaseModel):
    snapshot_id: int

class RiskInDB(BaseModel):
    id: int
    title: str
    severity: conint(ge=1, le=5)
    priority: conint(ge=1, le=5)
    detail: str
    suggestion: str
    class Config:
        from_attributes = True

class SimulationRequest(BaseModel):
    snapshot_id: int
    sales_change_pct: confloat(ge=-100, le=100) = 0
    expense_change_pct: confloat(ge=-100, le=100) = 0
    lose_top_client: bool = False
    supplier_failure_weeks: conint(ge=0, le=12) = 0

class SimulationResult(BaseModel):
    revenue_monthly: float
    expenses_monthly: float
    runway_months: float
    notes: List[str]

class CopilotRequest(BaseModel):
    snapshot_id: int
    question: str = Field(min_length=4)

class CopilotReply(BaseModel):
    answer: str

class ActionItemInDB(BaseModel):
    id: int
    title: str
    description: str
    impact: conint(ge=1, le=5)
    effort: conint(ge=1, le=5)
    due_days: conint(ge=0, le=365)
    class Config:
        from_attributes = True
