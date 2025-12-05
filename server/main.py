from fastapi import FastAPI
from pydantic import BaseModel
from judge import judge
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    code: str
    lang: str

@app.post("/run")
def run_code(req: Request):
    return judge(req.lang, req.code)
