import os
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Configure Google AI API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Define request model
class CodeRequest(BaseModel):
    code: str

# Define the AI review route
@app.post("/review")
async def review_code(request: CodeRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        # Strong prompt to enforce plain text output
        prompt = f"""
        You are an AI code reviewer. 
        Review the following code and suggest improvements.
        Return your feedback ONLY as plain text sentences. 
        Do not use JSON, Markdown, or special formatting.

        Code snippet:
        {request.code}
        """

        print("📨 Sending prompt to Gemini...")
        response = model.generate_content(prompt)

        # Log the raw response for debugging
        print("✅ Raw Gemini response:", response)

        # First try .text
        if response and response.text:
            print("📄 Gemini returned .text:", response.text)
            return {"review": response.text}

        # Fallback: check candidates
        if response and response.candidates:
            candidate_texts = [
                part.text
                for candidate in response.candidates
                for part in candidate.content.parts
                if hasattr(part, "text")
            ]
            if candidate_texts:
                joined_text = " ".join(candidate_texts)
                print("📄 Gemini returned from candidates:", joined_text)
                return {"review": joined_text}

        # If still nothing
        print("⚠️ Gemini returned no usable text")
        return {"error": "Invalid review data — no text in Gemini response"}

    except Exception as e:
        print("❌ Exception in review_code:", str(e))
        return {"error": str(e)}
