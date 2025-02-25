import streamlit as st
import requests

# Streamlit UI
st.title("AI-Powered HR Recruitment System")

# Input fields
job_title = st.text_input("Job Title")
job_description = st.text_area("Job Description")
resume_file = st.file_uploader("Upload Resume (PDF or TXT)", type=["pdf", "txt"])
cover_letter = st.text_area("Cover Letter (Optional)")

# Analyze button
if st.button("Analyze Resume"):
    if resume_file is not None:
        # Prepare form data
        files = {"resume_file": (resume_file.name, resume_file, resume_file.type)}
        data = {
            "job_title": job_title,
            "job_description": job_description,
            "cover_letter": cover_letter or ""
        }

        # Send request to FastAPI
        response = requests.post("https://obliged-wandis-aditech-18661c81.koyeb.app/analyze", files=files, data=data)

        if response.status_code == 200:
            result = response.json()["data"]
            
            # Display Match Result
            st.subheader("🔍 Match Result")
            st.markdown(f"**Match Score:** {result['match_result']['match_score'] * 100:.1f}%")
            st.markdown(f"**Is a Match?** {'✅ Yes' if result['match_result']['is_match'] else '❌ No'}")

            # Display Evaluation (if available)
            if result["evaluation"]:
                st.subheader("📊 Resume Evaluation")
                st.markdown(f"**Strength Level:** {result['evaluation']['strength_level'].capitalize()}")
                st.markdown(f"**Recommendation:** {result['evaluation']['recommendation']}")

            # Display Questions (if available)
            if result["questions"] and result["questions"]["questions"]:
                st.subheader("❓ Interview Questions")
                for idx, question in enumerate(result["questions"]["questions"], 1):
                    st.markdown(f"{idx}. {question}")

        else:
            st.error(f"Error: {response.text}")