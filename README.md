User Authentication API  

A JWT-based authentication system built with Node.js, Express, MongoDB, and React.js. This project provides secure user authentication with role-based access for Admin and User and protected routes.  

Features:  
- User Registration and Authentication using JWT and Bcrypt  
- Login and Logout with JWT stored in HttpOnly Cookie  
- Protected Routes for Profile and Admin Dashboard  
- Role-Based Access Control for Admin and User  
- Secure Password Hashing using Bcrypt.js  
- Real-Time Form Validation in Signup  

Tech Stack:  

Backend:  
- Node.js  
- Express.js  
- MongoDB and Mongoose  
- Bcrypt.js for Password Hashing  
- JWT for Authentication  
- Dotenv for Environment Variables  
- Cookie-Parser for Managing JWT in Cookies  

Frontend:  
- React.js  
- React Router for Navigation  
- React Hot Toast for Notifications  
- Context API for Authentication Management  
- TailwindCSS or CSS Modules for Styling  
- Axios for API Requests  

Installation and Setup:  

1. Clone the Repository  
Run the following commands:  
git clone https://github.com/your-username/your-repo.git  
cd your-repo  

2. Setup Backend  

Install Dependencies:  
cd backend  
npm install  

Configure Environment Variables:  
Create a .env file inside the backend folder and add the following details:  

PORT=5000  
MONGO_DB_URI=your-mongodb-uri  
JWT_SECRET=your-secret-key  
NODE_ENV=development  

Start Backend Server:  
npm start  
The server will start at http://localhost:5000  

3. Setup Frontend  

Install Dependencies:  
cd ../frontend  
npm install  

Start Frontend:  
npm run dev  
The frontend will start at http://localhost:5173  

API Endpoints:  

Authentication Routes:  
POST /api/auth/signup - Register new user (Public)  
POST /api/auth/login - Login user and get JWT (Public)  
POST /api/auth/logout - Logout and clear token (Authenticated)  

User Routes:  
GET /api/users/profile - Get user profile (Authenticated)  
GET /api/users/admin - Get all users (Admin Only)  

Role-Based Access:  
Users can access the profile page  
Admins can access the admin dashboard  
Protected routes require JWT authentication  

Frontend Structure:  

The frontend folder contains the following structure:  

frontend/  
- src/  
  - components/ for UI Components such as Buttons and Navbar  
  - pages/ for Login, Signup, Home, and AdminDashboard  
  - context/ for Authentication Context  
  - hooks/ for Custom Hooks such as useLogin, useSignup, and useLogout  
  - styles/ for CSS Modules  
  - App.jsx as the Main App Component  
  - main.jsx as the Entry Point  
  - routes/ for React Router Configuration  
  - utils/ for Utility Functions  
  - api/ for API Calls  
  
Developed by:Neha Patil - GitHub: https://github.com/your-username  
