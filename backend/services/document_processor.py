"""
Document processing service with AI analysis
"""
import os
import tempfile
from typing import List, Dict, Any
from ..utils.parse import FileParser, chunk_text
from ..utils.vector_store import VectorStore, EmbeddingGenerator, create_document_chunks
from .azure_openai import azure_openai_service

class DocumentProcessor:
    """Process and analyze documents with AI"""
    
    def __init__(self):
        self.file_parser = FileParser()
        self.vector_store = VectorStore()
        self.embedding_generator = EmbeddingGenerator()
    
    async def process_file(self, file_content: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        """Process uploaded file and extract insights"""
        try:
            # Save file temporarily
            file_ext = os.path.splitext(filename)[1].lower()
            
            with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as temp_file:
                temp_file.write(file_content)
                temp_path = temp_file.name
            
            try:
                # Parse file content
                parsed_content = self.file_parser.parse_file(temp_path, file_ext)
                
                # Convert to string if needed
                if isinstance(parsed_content, dict):
                    content_str = str(parsed_content)
                else:
                    content_str = str(parsed_content)
                
                # Analyze with AI
                analysis = await azure_openai_service.analyze_document(content_str, filename)
                
                # Create chunks for vector storage
                chunks = create_document_chunks(content_str, filename, file_ext)
                
                # Generate embeddings
                chunk_texts = [chunk['chunk_text'] for chunk in chunks]
                embeddings = await azure_openai_service.generate_embeddings(chunk_texts)
                
                # Store in vector database
                if embeddings and len(embeddings) > 0:
                    import numpy as np
                    embeddings_array = np.array(embeddings)
                    self.vector_store.add_documents(embeddings_array, chunks)
                
                return {
                    "filename": filename,
                    "size": len(file_content),
                    "type": content_type,
                    "status": "processed",
                    "analysis": analysis,
                    "chunks_created": len(chunks),
                    "content_preview": content_str[:500]
                }
                
            finally:
                # Clean up temp file
                os.unlink(temp_path)
                
        except Exception as e:
            return {
                "filename": filename,
                "size": len(file_content),
                "type": content_type,
                "status": "error",
                "error": str(e),
                "analysis": None,
                "chunks_created": 0
            }
    
    async def search_documents(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Search processed documents for relevant content"""
        try:
            # Generate query embedding
            query_embeddings = await azure_openai_service.generate_embeddings([query])
            
            if not query_embeddings:
                return []
            
            import numpy as np
            query_vector = np.array(query_embeddings[0])
            
            # Search vector store
            results = self.vector_store.search(query_vector, k)
            
            return results
            
        except Exception as e:
            print(f"Error searching documents: {e}")
            return []
    
    async def get_contextual_response(self, user_message: str, uploaded_files: List[str] = None) -> str:
        """Get AI response with document context"""
        try:
            # Search for relevant document content
            relevant_docs = await self.search_documents(user_message)
            
            # Build context from relevant documents
            context = ""
            if relevant_docs:
                context = "Relevant document excerpts:\n\n"
                for doc in relevant_docs[:3]:  # Use top 3 results
                    context += f"From {doc.get('filename', 'document')}: {doc.get('chunk_text', '')[:300]}...\n\n"
            
            # Generate response with context
            messages = [{"role": "user", "content": user_message}]
            response = await azure_openai_service.chat_completion(messages, context)
            
            return response
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"

# Global processor instance
document_processor = DocumentProcessor()