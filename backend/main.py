import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, Header, HTTPException

# Load environment variables from .env file located in the same directory as this file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, risk_analysis, simulation, copilot, actions
from models.database import init_db

API_KEY = os.getenv("BACKEND_API_KEY", "")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(title="Business Resilience Copilot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def require_api_key(x_api_key: str = Header(default="")):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(upload.router, prefix="/api", dependencies=[Depends(require_api_key)])
app.include_router(risk_analysis.router, prefix="/api", dependencies=[Depends(require_api_key)])
app.include_router(simulation.router, prefix="/api", dependencies=[Depends(require_api_key)])
app.include_router(copilot.router, prefix="/api", dependencies=[Depends(require_api_key)])
app.include_router(actions.router, prefix="/api", dependencies=[Depends(require_api_key)])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
