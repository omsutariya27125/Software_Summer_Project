from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from jose.exceptions import JWTError
from pymongo.errors import PyMongoError

from routes.authorisation import router as auth_router
from routes.homepage import router as homepage_router
from routes.attempt import router as attempt_router

# Use the default uvicorn error logger to output messages to the terminal
logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="MathGenius API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(JWTError)
async def jwt_exception_handler(request: Request, exc: JWTError):
    logger.error(f"JWT Verification failed: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "error": "Unauthorized",
            "message": "Invalid, expired, or malformed authentication token.",
            "details": str(exc)
        }
    )

@app.exception_handler(PyMongoError)
async def pymongo_exception_handler(request: Request, exc: PyMongoError):
    logger.error(f"Database error occurred: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "error": "DatabaseError",
            "message": "A database operation failed or the database is unavailable. Please check the connection.",
            "details": str(exc)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error occurred: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "ValidationError",
            "message": "The request body or query parameters failed validation.",
            "details": exc.errors()
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP exception occurred: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTPException",
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def universal_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception occurred: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": exc.__class__.__name__,
            "message": "An unexpected error occurred on the server.",
            "details": str(exc),
            "traceback": traceback.format_exc().split("\n")
        }
    )

app.include_router(auth_router)
app.include_router(homepage_router)
app.include_router(attempt_router)
