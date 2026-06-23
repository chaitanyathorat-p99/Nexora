import os
import base64
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def encode_image(image_path):
    """
    Reads an image from disk and returns its base64 encoded string.
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_image_captions(image_paths):
    """
    Takes a list of image paths, sends each to Groq's Vision model, 
    and returns a list of formatted text captions.
    """
    captions = []
    
    if not image_paths:
        return captions
        
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
        
    client = Groq(api_key=api_key)
    
    print(f"Generating captions for {len(image_paths)} images...")
    
    for path in image_paths:
        try:
            # Determine mime type based on extension
            ext = os.path.splitext(path)[1].lower()
            mime_type = "image/jpeg"
            if ext == ".png":
                mime_type = "image/png"
            elif ext in [".jpg", ".jpeg"]:
                mime_type = "image/jpeg"
            elif ext == ".webp":
                mime_type = "image/webp"
            elif ext == ".gif":
                mime_type = "image/gif"
                
            base64_image = encode_image(path)
            
            # Formulate the message for the Vision model
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this diagram or image in detail so its content can be searched and fully understood through text alone. Describe all text, shapes, data points, or relationships present."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
            
            # Send to Groq using their new multimodal model
            # Note: llama-3.2-11b-vision-preview was decommissioned in April 2025
            # The official replacement is meta-llama/llama-4-scout-17b-16e-instruct
            chat_completion = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=messages,
                temperature=0.2,
                max_tokens=1024
            )
            
            description = chat_completion.choices[0].message.content
            
            # Format the output so the retriever and LLM can link it back to the image
            # We use forward slashes for the path to be cross-platform friendly in the prompt
            normalized_path = path.replace("\\", "/")
            formatted_caption = f"[DIAGRAM_REF: {normalized_path}]\nDiagram Description:\n{description}"
            
            captions.append(formatted_caption)
            print(f"  - Generated caption for {os.path.basename(path)}")
            
        except Exception as e:
            print(f"Error generating caption for {path}: {e}")
            
    return captions
