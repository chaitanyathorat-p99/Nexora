import fitz  # PyMuPDF
import os

def load_pdf(file_path):
    """
    Loads a PDF file, extracts its text, and extracts its images.
    Returns a tuple: (full_text, list_of_image_paths)
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")

    doc = fitz.open(file_path)
    
    # Create a directory to save images
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    output_dir = os.path.join(os.path.dirname(file_path), "extracted_images", base_name)
    os.makedirs(output_dir, exist_ok=True)
    
    extracted_text = []
    image_paths = []
    
    for page_num, page in enumerate(doc):
        # 1. Extract Text
        text = page.get_text("text")
        if text:
            extracted_text.append(text)
            
        # 2. Extract Images
        images = page.get_images(full=True)
        for img_index, img in enumerate(images):
            try:
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Default to png if ext is weird, though fitz usually gets it right
                if not image_ext:
                    image_ext = "png"
                    
                image_filename = os.path.join(output_dir, f"page{page_num+1}_img{img_index+1}.{image_ext}")
                
                # Save the image
                with open(image_filename, "wb") as f:
                    f.write(image_bytes)
                    
                image_paths.append(image_filename)
            except Exception as e:
                print(f"Warning: Failed to extract an image on page {page_num+1}: {e}")
                
    full_text = "\n".join(extracted_text)
    
    if not full_text.strip() and not image_paths:
        raise ValueError("No text or images could be extracted from the PDF.")
        
    return full_text, image_paths
