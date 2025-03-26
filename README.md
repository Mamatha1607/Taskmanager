# 🧠 Collaborative Task Manager ✅

A full-stack task manager web application that allows users to securely manage personal tasks with features like authentication, CRUD operations, and responsive UI — built with **React**, **Node.js**, and **PostgreSQL**.

---

## 🚀 Tech Stack

**Frontend**: React, Bootstrap, Axios, React Router  
**Backend**: Node.js, Express.js, PostgreSQL  
**Authentication**: JWT (JSON Web Tokens)  
**Database**: PostgreSQL  
**ORM**: Raw SQL with `pg`  
**Optional**: GraphQL support (in-progress)

---

## ✨ Features

- 🔐 User Signup/Login with JWT-based authentication
- 📋 Create, Read, Update, Delete (CRUD) tasks
- 🧍‍♂️ User-specific task lists
- 🗓️ Task due dates, priority, category, tags
- 🖥️ Responsive and clean UI
- 📦 Scalable backend API
- 🧾 Secure password hashing with `bcrypt`
- 🛠️ REST API + optional GraphQL integration

---

collaborative-task-manager/.  
│ ├── backend/ # Node.js + Express + PostgreSQL  
│ ├── routes/ # REST API routes (tasks, users)   
│ ├── middleware/ # Auth middleware (JWT)   
│ ├── graphql/ # (Optional) GraphQL schema  
│ ├── db.js # PostgreSQL connection   
│ ├── server.js # Main backend server  
│ └── .env # Environment variables     
│ ├── frontend/ # React application   
│ ├── src/   
│ │ ├── pages/ # Home, Login, Register, Dashboard   
│ │ └── App.js   
│ ├── public/  
│ └── package.json   
│ └── README.md  

setup backend:cd backend  
npm install  
touch .env  
Add this to your .env file:  
DB_USER=postgres  
DB_PASSWORD=your_db_password  
DB_HOST=localhost  
DB_PORT=5432  
DB_DATABASE=task_manager_db  
JWT_SECRET=your_secret_key  
# Make sure PostgreSQL is running  
npm start  

3. Setup Frontend  
cd ../frontend  
npm install  
npm start  
Go to: http://localhost:3000  
