import os
import re
import shutil
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from pdf_loader import load_pdf
from chunker import split_text
from embedder import generate_embeddings
from mongo_store import store_in_mongodb
from retriever import retrieve_relevant_chunks
from llm_response import generate_response
from vision_captioner import generate_image_captions

load_dotenv()

app = FastAPI(title="Nexora RAG Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ingest")
async def ingest_pdf(file: UploadFile = File(...)):
    """
    Upload and ingest a PDF file into the vector store.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Save uploaded file to a temp location
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, file.filename)
    try:
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        text, image_paths = load_pdf(tmp_path)
        chunks = split_text(text)

        if image_paths:
            image_captions = generate_image_captions(image_paths)
            chunks.extend(image_captions)

        embeddings = generate_embeddings(chunks)
        store_in_mongodb(chunks, embeddings)

        return {
            "success": True,
            "message": f"Ingested {len(chunks)} chunks from '{file.filename}'.",
            "chunks": len(chunks),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


@app.post("/chat")
def chat(request: ChatRequest):
    """
    Answer a question using the RAG pipeline.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        relevant_chunks = retrieve_relevant_chunks(request.query)
        answer = generate_response(request.query, relevant_chunks)

        # Strip diagram refs from the answer text
        clean_answer = re.sub(r"\[DIAGRAM_REF:\s*.*?\]", "", answer).strip()

        return {"success": True, "answer": clean_answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
