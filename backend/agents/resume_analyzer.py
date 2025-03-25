import groq
import logging
import re 
from loguru import logger

class ResumeAnalyzer:
    def __init__(self, api_key):
        self.client = groq.Client(api_key=api_key)

    def match_resume_with_jd(self, resume_text, job_description):
        """Match resume with job description using Groq API."""
        prompt = f"""
        Analyze the following resume and job description. Determine if the resume is a good match for the job.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Provide a match score between 0 and 1 and a boolean indicating if the resume is a match.
        **Format your response strictly as:**
        Match Score: [score]
        Is Match: [True/False]
        """

        logger.info(f"Groq API Input Prompt: {prompt}")  # Log input

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI trained in resume analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )

        analysis = response.choices[0].message.content
        logger.info(f"Groq API Response: {analysis}")  # Log raw response

        # Parse using regex for robustness
        try:
            match_score = float(re.search(r"Match Score: (\d+\.?\d*)", analysis).group(1))
            is_match = "True" in re.search(r"Is Match: (True|False)", analysis).group(1)
        except Exception as e:
            logger.error(f"Failed to parse Groq response: {e}")
            match_score = 0.0
            is_match = False

        return {"match_score": match_score, "is_match": is_match}