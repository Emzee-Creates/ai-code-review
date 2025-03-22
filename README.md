My first complete project utilizing both Backend(node.js and Express), frontend(html, css and javascript) as well as Google's Gemini API with FastAPI.

The project is an AI-powered tool that provides automated code reviews, helping developers improve code quality and efficiency. 

📌 Features 

User Authentication: Secure login and signup with JWT-based authentication.  
Live AI Code Review: Real-time AI feedback using WebSockets.  
Recent Reviews Storage: Keeps track of the last five reviews for reference. (This is unfortunately currently bugged and I will be putting out a fix in thenearest future). 
Dark Mode Toggle: User-friendly UI with a sleek dark mode option.  
Profile Management: Users can update their name, email, and profile picture.  
Secure API: Uses rate limiting and session expiry handling.  

 
 Tech Stack 

Backend 
- FastAPI: AI-powered code analysis API.  
- Node.js + Express: Handles authentication and user management.  
- MongoDB: Stores user profiles and authentication data.  

Frontend 
- HTML, CSS, JavaScript: Responsive and GitHub-inspired UI.  
- WebSockets: Real-time review updates.  


If you have any interest in using the repository, you can follow the steps below:

1️⃣ Clone the Repository 
In your terminal, run: 

git clone https://github.com/your-username/ai-code-review.git
cd ai-code-review


2️⃣ Backend Setup 
FastAPI AI Review API

cd ai-api
pip install -r requirements.txt
uvicorn main:app --reload


Node.js Authentication API 

cd backend
npm install
node server.js

3️⃣ Frontend Setup
Just open '../frontend/dashboard.html'in your browser.  




📜 License 
This project is licensed under the **MIT License**.  

🎯 **Contributions Welcome!** Feel free to fork the repo and submit a PR! 🚀
