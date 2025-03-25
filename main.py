import tempfile
import os
import uvicorn
from typing import Optional
from pdf2image import convert_from_bytes
from pytesseract import image_to_string
from pydantic import BaseModel
from dotenv import load_dotenv
from loguru import logger
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from backend.services.recruitment_workflow import RecruitmentWorkflow
from backend.services.streaming_workflow import StreamingRecruitmentWorkflow
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader

# Load environment variables
load_dotenv()


# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Import and include API router
from backend.routes import api_router
app.include_router(api_router)

# Define request schema
class RecruitmentRequest(BaseModel):
    job_title: str
    job_description: str
    resume_text: str
    cover_letter: str = None

# Define response schema
class RecruitmentResponse(BaseModel):
    status: str
    data: dict

from pytesseract import image_to_string
from pdf2image import convert_from_bytes

def extract_text_from_pdf(file: UploadFile):
    """Extract text from a PDF file."""
    try:
        # Try text extraction first
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file.file.read())
            temp_file_path = temp_file.name

        loader = PyPDFLoader(temp_file_path)
        pages = loader.load()
        text = "\n".join(page.page_content for page in pages)
        os.remove(temp_file_path)

        # Fallback to OCR if no text is found
        if not text.strip():
            images = convert_from_bytes(file.file.read())
            text = " ".join([image_to_string(img) for img in images])

        logger.info(f"Extracted Text (First 200 chars): {text[:200]}...")  # Log sample text
        return text
    except Exception as e:
        logger.error(f"PDF Extraction Error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {e}")
@app.get("/")
def read_root():
    return {"message": "welcome to the AI-Powered HR Recruitment System!"}

@app.post("/analyze", response_model=RecruitmentResponse)
async def analyze_candidate(
    job_title: str = Form(...),  # Use Form(...) for form fields
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
    cover_letter: Optional[str] = Form(None)
):
    workflow = RecruitmentWorkflow()

    try:
        # Extract text from the uploaded file
        if resume_file.content_type == "application/pdf":
            resume_text = extract_text_from_pdf(resume_file)
        elif resume_file.content_type == "text/plain":
            resume_text = resume_file.file.read().decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or TXT file.")

        # Call the workflow
        result = workflow.run(
            job_title=job_title,
            job_description=job_description,
            resume_text=resume_text,
            cover_letter=cover_letter
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/stream")
async def stream_analyze_candidate(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
    cover_letter: Optional[str] = Form(None)
):
    workflow = StreamingRecruitmentWorkflow()
    
    try:
        # Extract text from the uploaded file
        if resume_file.content_type == "application/pdf":
            resume_text = extract_text_from_pdf(resume_file)
        elif resume_file.content_type == "text/plain":
            resume_text = resume_file.file.read().decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or TXT file.")
        
        # Create a streaming response using the streaming workflow
        return StreamingResponse(
            workflow.run_streaming(
                job_title=job_title,
                job_description=job_description,
                resume_text=resume_text,
                cover_letter=cover_letter
            ),
            media_type="application/json"
        )
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  
    uvicorn.run(app, host="0.0.0.0", port=port)