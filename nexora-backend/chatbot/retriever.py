import os
import numpy as np
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def cosine_similarity(vec_a, vec_b):
    """
    Computes the cosine similarity between two vectors.
    """
    # Convert lists of floats to numpy arrays
    a = np.array(vec_a)
    b = np.array(vec_b)
    
    # Calculate norms
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    # Return 0.0 if either norm is zero to avoid division by zero
    if norm_a == 0 or norm_b == 0:
        return 0.0
        
    # Compute dot product divided by the product of norms
    similarity = np.dot(a, b) / (norm_a * norm_b)
    
    # Return a float similarity score
    return float(similarity)

def retrieve_relevant_chunks(query, top_k=5):
    """
    Retrieves the most relevant text chunks for a given query from MongoDB.
    """
    # Load the sentence-transformers model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    # Embed the user query into a vector
    query_embedding = model.encode(query).tolist()
    
    # Connect to MongoDB
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["rag_db"]
    collection = db["documents"]
    
    # Fetch all documents with their embeddings
    documents = list(collection.find({}))
    
    # Compute cosine similarity between query vector and each document's embedding
    results = []
    for doc in documents:
        sim_score = cosine_similarity(query_embedding, doc["embedding"])
        results.append({
            "text": doc["text"],
            "score": sim_score
        })
        
    # Sort results by similarity score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    
    # Extract the top_k most relevant text chunks
    top_chunks = [result["text"] for result in results[:top_k]]
    
    # Return the list of strings
    return top_chunks
