"""
Azure OpenAI service for AI chat and document analysis
"""
import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from openai import AsyncAzureOpenAI
from dotenv import load_dotenv

load_dotenv()

class AzureOpenAIService:
    """Service for interacting with Azure OpenAI"""
    
    def __init__(self):
        self.client = AsyncAzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
        self.embedding_deployment = "text-embedding-ada-002"  # Standard embedding model
    
    async def chat_completion(
        self, 
        messages: List[Dict[str, str]], 
        context: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> str:
        """Generate chat completion with optional context"""
        try:
            # Add context to system message if provided
            if context:
                system_message = {
                    "role": "system",
                    "content": f"""You are a CIO Assistant AI helping with IT management tasks. 
                    Use the following context to provide accurate, helpful responses:
                    
                    Context: {context}
                    
                    Provide specific, actionable insights based on the context and user query."""
                }
                messages = [system_message] + messages
            else:
                system_message = {
                    "role": "system", 
                    "content": """You are a CIO Assistant AI specializing in IT management, 
                    infrastructure, security, and business technology strategy. Provide 
                    professional, actionable insights and recommendations."""
                }
                messages = [system_message] + messages
            
            response = await self.client.chat.completions.create(
                model=self.deployment_name,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in chat completion: {e}")
            return f"I apologize, but I'm experiencing technical difficulties. Error: {str(e)}"
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for text chunks"""
        try:
            response = await self.client.embeddings.create(
                model=self.embedding_deployment,
                input=texts
            )
            
            return [embedding.embedding for embedding in response.data]
            
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            # Return dummy embeddings as fallback
            return [[0.0] * 1536 for _ in texts]
    
    async def analyze_document(self, content: str, filename: str) -> Dict[str, Any]:
        """Analyze document content and extract insights"""
        try:
            messages = [
                {
                    "role": "user",
                    "content": f"""Analyze this document ({filename}) and provide:
                    1. Key insights and findings
                    2. Important metrics or data points
                    3. Potential risks or concerns
                    4. Recommendations for action
                    
                    Document content:
                    {content[:4000]}  # Limit content to avoid token limits
                    """
                }
            ]
            
            analysis = await self.chat_completion(messages, max_tokens=800)
            
            return {
                "filename": filename,
                "analysis": analysis,
                "content_preview": content[:500],
                "word_count": len(content.split()),
                "status": "analyzed"
            }
            
        except Exception as e:
            return {
                "filename": filename,
                "analysis": f"Error analyzing document: {str(e)}",
                "content_preview": content[:500],
                "word_count": len(content.split()),
                "status": "error"
            }
    
    async def generate_daily_brief(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive daily brief based on system metrics"""
        try:
            prompt = f"""Generate an executive daily brief based on these IT metrics:
            
            System Metrics: {json.dumps(metrics, indent=2)}
            
            Provide:
            1. Key risks that need immediate attention
            2. Notable wins and achievements
            3. Current blockers and challenges
            4. Executive summary with actionable recommendations
            
            Format as a professional executive brief."""
            
            messages = [{"role": "user", "content": prompt}]
            brief_content = await self.chat_completion(messages, max_tokens=1200)
            
            return {
                "date": "2024-01-15",
                "content": brief_content,
                "metrics_analyzed": len(metrics),
                "generated_at": "2024-01-15T10:30:00Z"
            }
            
        except Exception as e:
            return {
                "date": "2024-01-15",
                "content": f"Error generating brief: {str(e)}",
                "metrics_analyzed": 0,
                "generated_at": "2024-01-15T10:30:00Z"
            }
    
    async def generate_forecast(self, scenario: Dict[str, Any]) -> Dict[str, Any]:
        """Generate forecast based on scenario parameters"""
        try:
            prompt = f"""Generate a detailed IT forecast based on these parameters:
            
            Scenario: {json.dumps(scenario, indent=2)}
            
            Provide:
            1. Predicted outcomes for the given time horizon
            2. Risk factors and mitigation strategies
            3. Budget impact analysis
            4. Confidence intervals and assumptions
            5. Actionable recommendations
            
            Format as a professional forecast report."""
            
            messages = [{"role": "user", "content": prompt}]
            forecast_content = await self.chat_completion(messages, max_tokens=1200)
            
            return {
                "scenario": scenario,
                "forecast": forecast_content,
                "confidence": "Medium-High",
                "generated_at": "2024-01-15T10:30:00Z"
            }
            
        except Exception as e:
            return {
                "scenario": scenario,
                "forecast": f"Error generating forecast: {str(e)}",
                "confidence": "Low",
                "generated_at": "2024-01-15T10:30:00Z"
            }

# Global service instance
azure_openai_service = AzureOpenAIService()