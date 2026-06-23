import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def store_in_mongodb(chunks, embeddings):
    """
    Stores chunks and their corresponding embeddings into MongoDB.
    """
    try:
        # Connect to MongoDB using MONGO_URI from environment variables
        mongo_uri = os.getenv("MONGO_URI")
        client = MongoClient(mongo_uri)
        
        # Use database: rag_db, collection: documents
        db = client["rag_db"]
        collection = db["documents"]
        
        # Delete all existing documents before inserting
        collection.delete_many({})
        
        # Create documents in the specified format
        documents = []
        for chunk, embedding in zip(chunks, embeddings):
            doc = {
                "text": chunk,
                "embedding": embedding
            }
            documents.append(doc)
            
        # Insert all documents using insert_many()
        if documents:
            collection.insert_many(documents)
            
        # Print how many documents were stored
        print(f"Successfully stored {len(documents)} documents in MongoDB.")
        
    except Exception as e:
        print(f"Error storing in MongoDB: {e}")
        raise
