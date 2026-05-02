<div align="center">

### TaskSphere 🚀
> A full-stack team task management system with role-based access control, built using the MERN stack. Manage projects, assign tasks, and track progress efficiently.

</div>

---

## 🌐 Live Demo


---

## ✨ Features

| Feature | Description |
|--------|------------|
| 🔐 Authentication | Secure login/signup with JWT |
| 👥 Role-Based Access | Admin & Member roles |
| 📁 Project Management | Create and manage team projects |
| ✅ Task Assignment | Assign tasks to team members |
| 📊 Dashboard | Track progress, completed & overdue tasks |
| 🔍 Smart Filtering | Search and filter tasks easily |
| 📱 Responsive UI | Works across all devices |

---

## 🧠 System Highlights

- RESTful API architecture  
- Secure JWT-based authentication  
- Role-based authorization middleware  
- Optimized MongoDB schema design  
- Clean and scalable component structure  

---

## 🛠 Tech Stack

### Frontend:
- ⚛️ React + Hooks  
- 🎨 Tailwind CSS  
- 🛣️ React Router  

### Backend:
- 🟢 Node.js + Express  
- 🍃 MongoDB + Mongoose  
- 🔑 JWT Authentication  
- 🛡️ Middleware (Auth & Validation)  

---

## 🚀 Quick Start

### Prerequisites
```bash
node -v
mongod --version

Installation
# Clone repo
git clone https://github.com/YOUR_USERNAME/tasksphere-fullstack.git
cd tasksphere-fullstack

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

Environment Variables
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run Project
# Backend
npm run server

# Frontend
npm run client

📁 Project Structure
tasksphere/
├── client/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/

🔌 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login

Projects
POST /api/projects
GET /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

Tasks
POST /api/tasks
GET /api/tasks/:projectId
PUT /api/tasks/:id
DELETE /api/tasks/:id

**Environment Variables**
bash
VITE_API_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key
### 🎯 Usage **Demo Account**
bash
Email: demo@example.com
Password: demopassword123
### Key Features in Action
bash
# Create a new task
📝 Click "New Task" → Fill details → Save

# Filter tasks
🔍 Use search bar → Apply filters → Bulk actions

# Manage workflow
🔄 Drag tasks → Change status → Add tags → Set due dates
### 📁 Project Structure
bash

taskflow/
├── src/
│   ├── components/     # React components
│   │   ├── tasks/     # Task components
│   │   ├── auth/      # Auth components  
│   │   └── ui/        # Reusable UI
│   ├── contexts/      # React contexts
│   ├── services/      # API services
│   └── utils/         # Helpers & validation
├── backend/
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   └── middleware/    # Auth & error handling
└── public/           # Static assets

### 🎨 Components Overview **Core Components** - Component Purpose - Dashboard Main task overview with stats - TaskList Display and manage tasks - TaskForm Create/edit task modal - TaskItem Individual task card - SearchFilter Advanced filtering ### Auth Components - Component Purpose - Login User authentication - Register New user signup - ForgotPassword Password recovery - ProtectedRoute Route protection ### 🔌 API Endpoints **Authentication**

bash
POST /api/auth/register    # Create account
POST /api/auth/login       # User login
GET  /api/auth/me         # Current user
**Tasks**

bash
GET    /api/tasks         # Get tasks (with filters)
POST   /api/tasks         # Create task
PUT    /api/tasks/:id     # Update task
DELETE /api/tasks/:id     # Delete task
### 🎨 Styling & Design **Custom CSS Classes**

bash
.btn-primary    /* Gradient action buttons */
.card-glass    /* Glass morphism containers */
.input-modern  /* Modern form inputs */
.animate-float /* Floating animations */
### 🚀 Deployment **Frontend (Render)**

bash
npm run build
render --prod

**Backend**
bash
npm run build
render
### Production Environment
bash
NODE_ENV=production
MONGODB_URI=your-production-db
JWT_SECRET=your-production-secret
### 🤝 Contributing <div align="center"> **We love contributions! Here's how to help:** - 🍴 Fork the repo - 🌿 Create a feature branch: git checkout -b feature/amazing-feature - 💾 Commit changes: git commit -m 'Add amazing feature' - 📤 Push to branch: git push origin feature/amazing-feature - 🔀 Open a Pull Request
