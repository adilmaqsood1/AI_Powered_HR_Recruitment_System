import requests

class APIClient:
    def __init__(self, base_url):
        """
        Initialize the API client with the base URL of the FastAPI backend.
        """
        self.base_url = base_url

    def analyze_resume(self, job_title, job_description, resume_text, cover_letter=None):
        """
        Send a request to the FastAPI backend to analyze the resume.
        """
        payload = {
            "job_title": job_title,
            "job_description": job_description,
            "resume_text": resume_text,
            "cover_letter": cover_letter
        }
        response = requests.post(f"{self.base_url}/analyze", json=payload)
        return response.json()

    def generate_questions(self, resume_text):
        """
        Send a request to the FastAPI backend to generate interview questions.
        """
        payload = {"resume_text": resume_text}
        response = requests.post(f"{self.base_url}/generate-questions", json=payload)
        return response.json()