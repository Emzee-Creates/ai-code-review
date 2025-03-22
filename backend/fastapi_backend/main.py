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
        model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Using the best available model

        response = model.generate_content(
            f"Review this code and suggest improvements:\n{request.code}"
        )

        return {"review": response.text} if response else {"error": "Empty response from Gemini"}
    except Exception as e:
        return {"error": str(e)}
