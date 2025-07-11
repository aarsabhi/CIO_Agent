from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
from dotenv import load_dotenv
import uvicorn
import logging

from services.document_processor import DocumentProcessor
from services.azure_openai import AzureOpenAIService
from utils.vector_store import VectorStore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="CIO Assistant API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
try:
    document_processor = DocumentProcessor()
    azure_openai = AzureOpenAIService()
    vector_store = VectorStore()
    logger.info("Services initialized successfully")
except Exception as e:
    logger.error(f"Error initializing services: {e}")
    document_processor = DocumentProcessor()
    azure_openai = AzureOpenAIService()
    vector_store = VectorStore()

@app.get("/")
async def root():
    return {"message": "CIO Assistant API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "azure_openai_configured": azure_openai.client is not None,
        "vector_store_ready": vector_store.is_trained
    }

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload and process multiple files"""
    try:
        results = []
        for file in files:
            # Create uploads directory if it doesn't exist
            os.makedirs("uploads", exist_ok=True)
            
            # Save uploaded file
            file_path = f"uploads/{file.filename}"
            
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Process file
            try:
                processed_content = document_processor.process_file(file_path)
                
                # Add to vector store
                vector_store.add_document(processed_content, file.filename)
                
                results.append({
                    "filename": file.filename,
                    "status": "processed",
                    "content_length": len(processed_content)
                })
                
                logger.info(f"Successfully processed file: {file.filename}")
                
            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {e}")
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": str(e)
                })
        
        return {"files": results, "status": "success"}
    
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(message: dict):
    """Chat with AI assistant using RAG"""
    try:
        user_message = message.get("message", "")
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get relevant context from vector store
        context = vector_store.search(user_message)
        
        # Generate AI response
        response = azure_openai.generate_response(user_message, context)
        
        return {"response": response, "status": "success"}
    
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/brief")
async def get_daily_brief():
    """Generate daily executive brief"""
    try:
        # Mock data for now - would integrate with real systems
        brief = {
            "date": "2024-01-15",
            "risks": [
                {"title": "Server Capacity", "severity": "high", "description": "Approaching 85% capacity"},
                {"title": "Security Patch", "severity": "medium", "description": "Pending updates for 12 systems"}
            ],
            "wins": [
                {"title": "Migration Complete", "description": "Successfully migrated 50 applications"},
                {"title": "Cost Savings", "description": "Achieved 15% reduction in cloud costs"}
            ],
            "blockers": [
                {"title": "Budget Approval", "description": "Waiting for Q2 budget approval"},
                {"title": "Vendor Response", "description": "Pending response from security vendor"}
            ],
            "metrics": {
                "uptime": "99.8%",
                "incidents": 3,
                "resolved": 2,
                "budget_utilization": "78%"
            }
        }
        
        return brief
    
    except Exception as e:
        logger.error(f"Brief generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forecast")
async def generate_forecast(params: dict):
    """Generate forecast scenarios"""
    try:
        budget_increase = params.get("budget_increase", 0)
        time_horizon = params.get("time_horizon", 12)
        metric = params.get("metric", "performance")
        
        # Mock forecast data - would use real ML models
        forecast = {
            "scenario": f"{budget_increase}% budget increase over {time_horizon} months",
            "predictions": {
                "performance_improvement": f"{budget_increase * 0.8}%",
                "risk_reduction": f"{budget_increase * 0.6}%",
                "cost_efficiency": f"{budget_increase * 0.4}%"
            },
            "confidence": "85%",
            "recommendations": [
                "Focus on infrastructure automation",
                "Invest in security monitoring tools",
                "Expand cloud migration efforts"
            ]
        }
        
        return forecast
    
    except Exception as e:
        logger.error(f"Forecast generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting CIO Assistant API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)