import os
import pickle
import logging
from typing import List, Dict, Optional
import numpy as np
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self, store_path: str = "./vector_store"):
        self.store_path = store_path
        self.index = None
        self.documents = []
        self.metadata = []
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.is_trained = False
        
        # Create store directory if it doesn't exist
        os.makedirs(store_path, exist_ok=True)
        
        # Try to load existing index
        self._load_index()
    
    def add_document(self, content: str, filename: str, metadata: Optional[Dict] = None):
        """Add a document to the vector store"""
        try:
            # Split content into chunks
            chunks = self._chunk_text(content)
            
            for i, chunk in enumerate(chunks):
                self.documents.append(chunk)
                chunk_metadata = {
                    "filename": filename,
                    "chunk_id": i,
                    "total_chunks": len(chunks)
                }
                if metadata:
                    chunk_metadata.update(metadata)
                
                self.metadata.append(chunk_metadata)
            
            # Rebuild index with new documents
            self._build_index()
            self._save_index()
            
            logger.info(f"Added {len(chunks)} chunks from {filename} to vector store")
        
        except Exception as e:
            logger.error(f"Error adding document to vector store: {str(e)}")
            raise
    
    def search(self, query: str, k: int = 5) -> str:
        """Search for relevant documents"""
        try:
            if not self.is_trained or len(self.documents) == 0:
                return "No documents available for search."
            
            # Vectorize query
            query_vector = self.vectorizer.transform([query]).toarray().astype('float32')
            
            # Search in FAISS index
            distances, indices = self.index.search(query_vector, min(k, len(self.documents)))
            
            # Collect relevant chunks
            relevant_chunks = []
            for i, idx in enumerate(indices[0]):
                if idx != -1:  # Valid index
                    chunk = self.documents[idx]
                    metadata = self.metadata[idx]
                    relevant_chunks.append(f"From {metadata['filename']}: {chunk}")
            
            return "\n\n".join(relevant_chunks)
        
        except Exception as e:
            logger.error(f"Error searching vector store: {str(e)}")
            return f"Search error: {str(e)}"
    
    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings
                for i in range(end, max(start + chunk_size // 2, end - 100), -1):
                    if text[i] in '.!?':
                        end = i + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
        
        return chunks
    
    def _build_index(self):
        """Build FAISS index from documents"""
        try:
            if len(self.documents) == 0:
                return
            
            # Create TF-IDF vectors
            vectors = self.vectorizer.fit_transform(self.documents).toarray().astype('float32')
            
            # Create FAISS index
            dimension = vectors.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(vectors)
            
            self.is_trained = True
            logger.info(f"Built FAISS index with {len(self.documents)} documents")
        
        except Exception as e:
            logger.error(f"Error building FAISS index: {str(e)}")
            raise
    
    def _save_index(self):
        """Save index and metadata to disk"""
        try:
            if self.index is not None:
                # Save FAISS index
                faiss.write_index(self.index, os.path.join(self.store_path, "index.faiss"))
                
                # Save documents and metadata
                with open(os.path.join(self.store_path, "documents.pkl"), "wb") as f:
                    pickle.dump(self.documents, f)
                
                with open(os.path.join(self.store_path, "metadata.pkl"), "wb") as f:
                    pickle.dump(self.metadata, f)
                
                # Save vectorizer
                with open(os.path.join(self.store_path, "vectorizer.pkl"), "wb") as f:
                    pickle.dump(self.vectorizer, f)
                
                logger.info("Saved vector store to disk")
        
        except Exception as e:
            logger.error(f"Error saving vector store: {str(e)}")
    
    def _load_index(self):
        """Load index and metadata from disk"""
        try:
            index_path = os.path.join(self.store_path, "index.faiss")
            documents_path = os.path.join(self.store_path, "documents.pkl")
            metadata_path = os.path.join(self.store_path, "metadata.pkl")
            vectorizer_path = os.path.join(self.store_path, "vectorizer.pkl")
            
            if all(os.path.exists(path) for path in [index_path, documents_path, metadata_path, vectorizer_path]):
                # Load FAISS index
                self.index = faiss.read_index(index_path)
                
                # Load documents and metadata
                with open(documents_path, "rb") as f:
                    self.documents = pickle.load(f)
                
                with open(metadata_path, "rb") as f:
                    self.metadata = pickle.load(f)
                
                # Load vectorizer
                with open(vectorizer_path, "rb") as f:
                    self.vectorizer = pickle.load(f)
                
                self.is_trained = True
                logger.info(f"Loaded vector store with {len(self.documents)} documents")
        
        except Exception as e:
            logger.error(f"Error loading vector store: {str(e)}")
            # Initialize empty store on error
            self.index = None
            self.documents = []
            self.metadata = []
            self.is_trained = False
    
    def clear(self):
        """Clear all documents from the vector store"""
        try:
            self.index = None
            self.documents = []
            self.metadata = []
            self.is_trained = False
            
            # Remove saved files
            for filename in ["index.faiss", "documents.pkl", "metadata.pkl", "vectorizer.pkl"]:
                file_path = os.path.join(self.store_path, filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            logger.info("Cleared vector store")
        
        except Exception as e:
            logger.error(f"Error clearing vector store: {str(e)}")
    
    def get_stats(self) -> Dict:
        """Get statistics about the vector store"""
        return {
            "total_documents": len(self.documents),
            "is_trained": self.is_trained,
            "unique_files": len(set(meta["filename"] for meta in self.metadata)) if self.metadata else 0
        }