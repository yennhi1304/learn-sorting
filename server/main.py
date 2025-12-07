from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from judge import judge

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/run")
def preflight():
    return {}

@app.post("/run")
def run_code(payload: dict):
    return judge(payload.get("lang"), payload.get("code"))
