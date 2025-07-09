import os
from typing import List, Optional
import openai
from azure.identity import DefaultAzureCredential
import logging

logger = logging.getLogger(__name__)

class AzureOpenAIService:
    def __init__(self):
        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
        self.api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2023-12-01-preview")
        
        if not self.api_key or not self.endpoint:
            logger.warning("Azure OpenAI credentials not configured")
            return
        
        # Configure Azure OpenAI client
        openai.api_type = "azure"
        openai.api_key = self.api_key
        openai.api_base = self.endpoint
        openai.api_version = self.api_version
    
    def generate_response(self, message: str, context: Optional[str] = None) -> str:
        """Generate AI response using GPT-4o with optional context"""
        try:
            if not self.api_key:
                return "Azure OpenAI is not configured. Please set up your API credentials."
            
            # Prepare system message with context
            system_message = "You are a helpful CIO assistant that provides insights on IT management, strategy, and operations."
            if context:
                system_message += f"\n\nRelevant context from uploaded documents:\n{context}"
            
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ]
            
            response = openai.ChatCompletion.create(
                engine=self.deployment_name,
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return f"I apologize, but I encountered an error while processing your request: {str(e)}"
    
    def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for text using Azure OpenAI"""
        try:
            if not self.api_key:
                return []
            
            response = openai.Embedding.create(
                engine="text-embedding-ada-002",
                input=text
            )
            
            return response.data[0].embedding
        
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            return []
    
    def generate_summary(self, text: str, max_length: int = 200) -> str:
        """Generate a summary of the provided text"""
        try:
            if not self.api_key:
                return "Summary generation unavailable - Azure OpenAI not configured."
            
            messages = [
                {
                    "role": "system", 
                    "content": f"Summarize the following text in no more than {max_length} words. Focus on key insights and actionable information."
                },
                {"role": "user", "content": text}
            ]
            
            response = openai.ChatCompletion.create(
                engine=self.deployment_name,
                messages=messages,
                max_tokens=max_length * 2,  # Rough token estimate
                temperature=0.3
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return f"Summary generation failed: {str(e)}"