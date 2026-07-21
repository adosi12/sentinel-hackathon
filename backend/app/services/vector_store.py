import chromadb
from chromadb.config import Settings
from app.core.config import settings

class VectorStore:
    def __init__(self):
        # We use HttpClient to connect to the separate ChromaDB container
        self.client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)
        self.collection = self.client.get_or_create_collection(
            name="sentinel_incidents",
            # We use the default sentence-transformers embedding function
        )
        
    def index_incident(self, incident_id: str, title: str, description: str, resolution: str, root_cause: str = ""):
        """Indexes a historical incident into ChromaDB."""
        # We embed the combination of title and description for semantic matching
        document_text = f"Title: {title}\nDescription: {description}"
        
        self.collection.add(
            documents=[document_text],
            metadatas=[{"title": title, "resolution": resolution, "root_cause": root_cause}],
            ids=[incident_id]
        )
        
    def search_similar_incidents(self, query_text: str, n_results: int = 3):
        """Searches for historically similar incidents based on the incoming alert text."""
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        # Format results into a list of dicts
        matches = []
        if results['metadatas'] and results['metadatas'][0]:
            for meta in results['metadatas'][0]:
                matches.append({
                    "title": meta.get("title", ""),
                    "resolution": meta.get("resolution", ""),
                    "root_cause": meta.get("root_cause", "")
                })
        return matches

vector_store = VectorStore()
