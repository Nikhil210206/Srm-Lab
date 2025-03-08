from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, tests


app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tests.router)

@app.get("/")
def read_root():
    return {"message": "SRM Lab Backend API"}
