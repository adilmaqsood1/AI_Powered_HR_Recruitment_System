import groq
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import re

class ResumeEvaluator:
    def __init__(self, api_key):
        self.client = groq.Client(api_key=api_key)

    def evaluate_resume_strength(self, resume_text):
        """Evaluate resume strength using Groq API."""
        prompt = f"""
        Analyze the following resume and evaluate its strength for a job application.

        Resume:
        {resume_text}

        Provide a strength level (low, medium, high) and a recommendation for the HR team.
        **Format your response strictly as:**
        Strength Level: <level>
        Recommendation: <recommendation>
        """

        response = self.client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "You are a helpful AI trained in resume evaluation."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )

        analysis = response.choices[0].message.content
        logger.info(f"Evaluation Response: {analysis}")

        # Use regex for robust parsing
        try:
            strength_level = re.search(r"Strength Level: (\w+)", analysis).group(1).lower()
            recommendation = re.search(r"Recommendation: (.+)", analysis).group(1)
        except AttributeError:
            strength_level = "low"
            recommendation = "Unable to evaluate resume strength."

        return {"strength_level": strength_level, "recommendation": recommendation}