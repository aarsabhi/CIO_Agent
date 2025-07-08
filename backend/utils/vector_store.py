"""
Vector store utilities for document embeddings and similarity search
"""
import os
import pickle
import numpy as np
from typing import List, Dict, Any, Optional
import faiss
from datetime import datetime

class VectorStore:
    """FAISS-based vector store for document embeddings"""
    
    def __init__(self, dimension: int = 1536, index_path: str = "vector_index.faiss"):
        self.dimension = dimension
        self.index_path = index_path
        self.metadata_path = index_path.replace('.faiss', '_metadata.pkl')
        
        # Initialize FAISS index
        self.index = faiss.IndexFlatL2(dimension)
        self.metadata = []
        
        # Load existing index if available
        self.load_index()
    
    def add_documents(self, embeddings: np.ndarray, metadata: List[Dict[str, Any]]):
        """Add document embeddings to the vector store"""
        if embeddings.shape[1] != self.dimension:
            raise ValueError(f"Embedding dimension {embeddings.shape[1]} doesn't match index dimension {self.dimension}")
        
        # Add to FAISS index
        self.index.add(embeddings.astype('float32'))
        
        # Add metadata
        self.metadata.extend(metadata)
        
        # Save index
        self.save_index()
    
    def search(self, query_embedding: np.ndarray, k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents"""
        if query_embedding.shape[0] != self.dimension:
            raise ValueError(f"Query embedding dimension doesn't match index dimension")
        
        # Reshape for FAISS
        query_vector = query_embedding.reshape(1, -1).astype('float32')
        
        # Search
        distances, indices = self.index.search(query_vector, k)
        
        # Prepare results
        results = []
        for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.metadata):
                result = self.metadata[idx].copy()
                result['similarity_score'] = float(1 / (1 + distance))  # Convert distance to similarity
                result['rank'] = i + 1
                results.append(result)
        
        return results
    
    def save_index(self):
        """Save FAISS index and metadata to disk"""
        try:
            faiss.write_index(self.index, self.index_path)
            
            with open(self.metadata_path, 'wb') as f:
                pickle.dump(self.metadata, f)
                
        except Exception as e:
            print(f"Error saving index: {e}")
    
    def load_index(self):
        """Load FAISS index and metadata from disk"""
        try:
            if os.path.exists(self.index_path):
                self.index = faiss.read_index(self.index_path)
            
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
                    
        except Exception as e:
            print(f"Error loading index: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get vector store statistics"""
        return {
            "total_documents": self.index.ntotal,
            "dimension": self.dimension,
            "metadata_count": len(self.metadata),
            "index_size_mb": os.path.getsize(self.index_path) / (1024 * 1024) if os.path.exists(self.index_path) else 0
        }
    
    def clear(self):
        """Clear all documents from the vector store"""
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        
        # Remove saved files
        for path in [self.index_path, self.metadata_path]:
            if os.path.exists(path):
                os.remove(path)

class EmbeddingGenerator:
    """Generate embeddings for text using Azure OpenAI (placeholder)"""
    
    def __init__(self, api_key: str = None, endpoint: str = None):
        self.api_key = api_key
        self.endpoint = endpoint
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        # Placeholder implementation - replace with actual Azure OpenAI call
        embeddings = []
        
        for text in texts:
            # Generate random embedding for demonstration
            # In production, this would call Azure OpenAI text-embedding-ada-002
            embedding = np.random.normal(0, 1, 1536)  # 1536 is ada-002 dimension
            embedding = embedding / np.linalg.norm(embedding)  # Normalize
            embeddings.append(embedding)
        
        return np.array(embeddings)
    
    def generate_single_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for a single text"""
        return self.generate_embeddings([text])[0]

def create_document_chunks(content: str, filename: str, file_type: str, chunk_size: int = 1000) -> List[Dict[str, Any]]:
    """Create document chunks with metadata"""
    from .parse import chunk_text
    
    chunks = chunk_text(content, chunk_size)
    
    chunk_metadata = []
    for i, chunk in enumerate(chunks):
        metadata = {
            "filename": filename,
            "file_type": file_type,
            "chunk_index": i,
            "chunk_text": chunk,
            "chunk_size": len(chunk),
            "created_at": datetime.now().isoformat()
        }
        chunk_metadata.append(metadata)
    
    return chunk_metadata