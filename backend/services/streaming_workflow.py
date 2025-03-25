import json
import asyncio
from backend.agents.resume_analyzer import ResumeAnalyzer
from backend.agents.resume_evaluator import ResumeEvaluator
from backend.agents.question_generator import QuestionGenerator
import os

class StreamingRecruitmentWorkflow:
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.resume_analyzer = ResumeAnalyzer(groq_api_key)
        self.resume_evaluator = ResumeEvaluator(groq_api_key)
        self.question_generator = QuestionGenerator(groq_api_key)

    async def run_streaming(self, job_title, job_description, resume_text, cover_letter=None):
        """
        Run the recruitment workflow in a streaming fashion, yielding results as they become available.
        """
        # Step 1: Match resume with JD
        match_result = self.resume_analyzer.match_resume_with_jd(resume_text, job_description)
        
        # Yield the match result as the first chunk
        yield json.dumps({"match_result": match_result})
        
        # If not a match, we're done
        if not match_result["is_match"]:
            return
        
        # Step 2: Evaluate resume strength
        evaluation_result = self.resume_evaluator.evaluate_resume_strength(resume_text)
        
        # Yield the evaluation result as the second chunk
        yield json.dumps({"evaluation": evaluation_result})
        
        # Step 3: Generate interview questions
        questions_result = self.question_generator.generate_questions(resume_text)
        
        # Yield the questions result as the third chunk
        yield json.dumps({"questions": questions_result})