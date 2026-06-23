import sys
import os
import re
from pdf_loader import load_pdf
from chunker import split_text
from embedder import generate_embeddings
from mongo_store import store_in_mongodb
from retriever import retrieve_relevant_chunks
from llm_response import generate_response
from vision_captioner import generate_image_captions

def main():
    try:
        # Repeatedly prompt for the PDF file until a valid file is provided
        while True:
            print("\nPlease enter the path to your PDF file (or type 'quit' to exit).")
            pdf_path = input("Path: ").strip().strip('"').strip("'")
            
            if pdf_path.lower() in ['quit', 'exit']:
                print("Exiting.")
                sys.exit(0)
                
            if not pdf_path:
                print("Path cannot be empty. Please try again.")
                continue
                
            if not os.path.exists(pdf_path):
                print(f"Error: Could not find the file at '{pdf_path}'. Please check the spelling and try again.")
                continue
                
            if not pdf_path.lower().endswith('.pdf'):
                print("Error: The file must be a PDF file.")
                continue
                
            # If we get here, the file exists and is a PDF
            break
            
        print(f"Loading PDF from {pdf_path}...")
        # Call load_pdf() to extract text and images
        text, image_paths = load_pdf(pdf_path)
        print(f"PDF loaded. Extracted {len(image_paths)} images.")
        
        print("Chunking text...")
        # Call split_text() to chunk the text
        chunks = split_text(text)
        print(f"Created {len(chunks)} text chunks.")
        
        if image_paths:
            print("Generating captions for extracted images using Vision LLM...")
            image_captions = generate_image_captions(image_paths)
            chunks.extend(image_captions)
            print(f"Added {len(image_captions)} image captions to chunks.")
        
        print("Generating embeddings...")
        # Call generate_embeddings() to embed the chunks
        embeddings = generate_embeddings(chunks)
        print("Embeddings generated.")
        
        print("Storing in MongoDB...")
        # Call store_in_mongodb() to save chunks and embeddings
        store_in_mongodb(chunks, embeddings)
        
        print("\n--- Setup Complete. Chatbot is ready! Type 'exit' or 'quit' to stop. ---\n")
        
        # Enter the while True loop
        while True:
            # Prompt user
            query = input("You: ")
            
            # Exit condition
            if query.strip().lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
                
            if not query.strip():
                continue
                
            try:
                # Retrieve relevant chunks
                relevant_chunks = retrieve_relevant_chunks(query)
                
                # Generate response
                answer = generate_response(query, relevant_chunks)
                # Check for DIAGRAM_REF in the answer
                diagram_refs = re.findall(r'\[DIAGRAM_REF:\s*(.*?)\]', answer)
                
                # Remove the raw tags from the text shown to the user
                clean_answer = re.sub(r'\[DIAGRAM_REF:\s*.*?\]', '', answer).strip()
                
                # Print the clean answer
                print(f"Bot: {clean_answer}")
                
                # Open the referenced images
                for img_path in set(diagram_refs):
                    if os.path.exists(img_path):
                        abs_path = os.path.abspath(img_path)
                        print(f"\n[Diagram Referenced: {abs_path}]")
                        print(f"[Opening image automatically in your default viewer...]")
                        try:
                            if hasattr(os, 'startfile'):
                                os.startfile(img_path)
                            elif sys.platform == "darwin":
                                import subprocess
                                subprocess.call(('open', img_path))
                            else:
                                import subprocess
                                subprocess.call(('xdg-open', img_path))
                        except Exception as e:
                            print(f"[Could not open image automatically: {e}]")
                    else:
                        print(f"\n[Diagram reference found, but file is missing: {img_path}]")
                
            except Exception as e:
                print(f"Error during query processing: {e}")
                
    except Exception as e:
        print(f"A critical error occurred: {e}")

if __name__ == "__main__":
    main()
