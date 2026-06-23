from sentence_transformers import SentenceTransformer

def generate_embeddings(chunks):
    """
    Generates embeddings for a list of text chunks using sentence-transformers.
    """
    try:
        # Load the sentence-transformers model
        model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Encode all chunks with a progress bar
        embeddings = model.encode(chunks, show_progress_bar=True)
        
        # Convert each numpy embedding array to a plain Python list
        # This is required for MongoDB compatibility
        embeddings_list = [embedding.tolist() for embedding in embeddings]
        
        # Return a list of float lists
        return embeddings_list
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise
