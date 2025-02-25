import groq
import logging
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuestionGenerator:
    def __init__(self, api_key):
        self.client = groq.Client(api_key=api_key)

    def generate_questions(self, resume_text):
        """Generate interview questions using Groq API."""
        prompt = f"""
        Generate interview questions based on the following resume.

        Resume:
        {resume_text}

        **Format your response strictly as:**
        Questions:
        1. <question>
        2. <question>
        ...
        """

        response = self.client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "You are a helpful AI trained in generating interview questions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000
        )

        analysis = response.choices[0].message.content
        logger.info(f"Question Generation Response: {analysis}")

        # Extract questions using regex
        try:
            questions = re.findall(r"\d+\.\s(.+)", analysis)
            if not questions:
                questions = ["Unable to generate questions."]
        except Exception as e:
            logger.error(f"Error parsing questions: {e}")
            questions = ["Unable to generate questions."]

        return {"questions": questions}