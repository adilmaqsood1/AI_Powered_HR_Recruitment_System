from backend.agents.resume_analyzer import ResumeAnalyzer
from backend.agents.resume_evaluator import ResumeEvaluator
from backend.agents.question_generator import QuestionGenerator
import os

class RecruitmentWorkflow:
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.resume_analyzer = ResumeAnalyzer(groq_api_key)
        self.resume_evaluator = ResumeEvaluator(groq_api_key)
        self.question_generator = QuestionGenerator(groq_api_key)

    def run(self, job_title, job_description, resume_text, cover_letter=None):
        # Step 1: Match resume with JD
        match_result = self.resume_analyzer.match_resume_with_jd(resume_text, job_description)

        if not match_result["is_match"]:
            return {"match_result": match_result, "evaluation": None, "questions": None}

        # Step 2: Evaluate resume strength
        evaluation_result = self.resume_evaluator.evaluate_resume_strength(resume_text)

        # Step 3: Generate interview questions
        questions_result = self.question_generator.generate_questions(resume_text)

        return {
            "match_result": match_result,
            "evaluation": evaluation_result,
            "questions": questions_result
        }