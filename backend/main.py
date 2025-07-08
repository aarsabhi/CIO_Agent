from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import tempfile
import shutil
from datetime import datetime

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
            
            # Process file (placeholder)
            processed_files.append({
                "filename": file.filename,
                "size": file.size,
                "type": file.content_type,
                "status": "processed",
                "uploaded_at": datetime.now().isoformat()
            })
        
        return {"files": processed_files, "message": "Files uploaded successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(message: dict):
    """Chat with AI assistant"""
    try:
        user_message = message.get("message", "")
        
        # Placeholder AI response
        ai_response = f"I understand you're asking about: {user_message}. This is a placeholder response. The AI integration will be implemented with Azure OpenAI."
        
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
        # Placeholder brief data
        brief = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "risks": [
                {"title": "Server Performance", "severity": "medium", "description": "Response times increased by 15%"},
                {"title": "Budget Variance", "severity": "high", "description": "Q4 spending 8% over budget"}
            ],
            "wins": [
                {"title": "Security Audit", "description": "Completed with zero critical findings"},
                {"title": "Team Productivity", "description": "Sprint velocity improved by 12%"}
            ],
            "blockers": [
                {"title": "Vendor Approval", "description": "Waiting for legal review of new SaaS contract"},
                {"title": "Resource Allocation", "description": "Need 2 additional developers for Q1 projects"}
            ],
            "metrics": {
                "system_uptime": "99.8%",
                "budget_utilization": "92%",
                "team_satisfaction": "8.2/10",
                "security_score": "95/100"
            }
        }
        
        return brief
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forecast")
async def generate_forecast(scenario: dict):
    """Generate forecast scenarios"""
    try:
        budget_increase = scenario.get("budget_increase", 0)
        time_horizon = scenario.get("time_horizon", 12)
        metric = scenario.get("metric", "performance")
        
        # Placeholder forecast data
        forecast = {
            "scenario": {
                "budget_increase": budget_increase,
                "time_horizon": time_horizon,
                "metric": metric
            },
            "predictions": [
                {"month": i, "value": 100 + (i * 2) + (budget_increase * 0.5)} 
                for i in range(1, time_horizon + 1)
            ],
            "confidence_interval": {
                "lower": [95 + (i * 1.5) for i in range(1, time_horizon + 1)],
                "upper": [105 + (i * 2.5) for i in range(1, time_horizon + 1)]
            },
            "generated_at": datetime.now().isoformat()
        }
        
        return forecast
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)