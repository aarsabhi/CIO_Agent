#!/usr/bin/env python3
"""
Backend server startup script
"""
import sys
import os
import subprocess
import logging

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    try:
        # Import and run the FastAPI app
        from backend.main import app
        import uvicorn
        
        logger.info("Starting CIO Assistant Backend Server...")
        logger.info("Server will be available at: http://localhost:8000")
        logger.info("API Documentation: http://localhost:8000/docs")
        
        # Start the server
        uvicorn.run(
            "backend.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        logger.error(f"Import error: {e}")
        logger.error("Please make sure all dependencies are installed")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Server startup error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()