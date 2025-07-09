from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import tempfile
import shutil
from datetime import datetime
from services.azure_openai import azure_openai_service
from services.document_processor import document_processor

app = FastAPI(title="CIO Assistant API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CIO Assistant API is running"}

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload and process multiple files"""
    try:
        processed_files = []
        
        for file in files:
            # Validate file size (10MB limit)
            if file.size and file.size > 10 * 1024 * 1024:
                raise HTTPException(status_code=413, detail=f"File {file.filename} is too large")
            
            # Validate file extension
            allowed_extensions = {'.pdf', '.docx', '.xlsx', '.csv', '.txt'}
            file_ext = os.path.splitext(file.filename or '')[1].lower()
            if file_ext not in allowed_extensions:
                raise HTTPException(status_code=400, detail=f"File type {file_ext} not supported")
            
            # Read file content
            file_content = await file.read()
            
            # Process file with AI
            result = await document_processor.process_file(
                file_content, 
                file.filename or "unknown", 
                file.content_type or "application/octet-stream"
            )
            
            result["uploaded_at"] = datetime.now().isoformat()
            processed_files.append(result)
        
        return {"files": processed_files, "message": "Files uploaded successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(message: dict):
    """Chat with AI assistant"""
    try:
        user_message = message.get("message", "")
        uploaded_files = message.get("uploaded_files", [])
        
        # Get contextual AI response
        ai_response = await document_processor.get_contextual_response(user_message, uploaded_files)
        
        return {
            "response": ai_response,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/brief")
async def get_daily_brief():
    """Generate daily executive brief"""
    try:
        # Sample metrics for brief generation
        metrics = {
            "system_uptime": 99.8,
            "budget_utilization": 92,
            "team_satisfaction": 8.2,
            "security_score": 95,
            "active_incidents": 3,
            "projects_on_track": 7,
            "projects_delayed": 2
        }
        
        # Generate AI-powered brief
        brief = await azure_openai_service.generate_daily_brief(metrics)
        
        return brief
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forecast")
async def generate_forecast(scenario: dict):
    """Generate forecast scenarios"""
    try:
        # Generate AI-powered forecast
        forecast = await azure_openai_service.generate_forecast(scenario)
        
        return forecast
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)