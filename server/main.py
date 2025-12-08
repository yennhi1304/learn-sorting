from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from judge import judge

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yennhi1304.github.io"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import Response
@app.options("/run")
def preflight():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )
