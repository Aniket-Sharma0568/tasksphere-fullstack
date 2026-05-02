<div align="center">

### TaskFlow 🚀
> A modern, sleek task management application built with React, Vite, and Tailwind CSS. Beautiful design, powerful features.

## 🛠️ Tech Stack
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232A)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=20232A)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.15-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=20232A)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.18.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

</div>

## 🚀 Live Demo
- **TaskSphere**: https://tasksphere-z2d1.onrender.com


## ✨ Features
**Feature	Description**
🎯 Task Management	Create, edit, delete tasks with rich metadata
🎨 Beautiful UI	Glass morphism, gradients, smooth animations
📱 Fully Responsive	Perfect on desktop, tablet, and mobile
🔍 Smart Search	Real-time filtering and advanced search
🏷 Tags & Priority	Organize tasks with tags and priority levels
📊 Dashboard	Visual statistics and progress tracking
🔐 Secure Auth	JWT authentication with protected routes
⚡ Fast & Modern	Built with Vite for lightning-fast performance

## 🛠 Tech Stack
**Frontend:**
⚛️ React 18 + Hooks
🎨 Tailwind CSS
🔮 Lucide Icons
🛣️ React Router

## Backend:
🟢 Node.js + Express
🍃 MongoDB + Mongoose
🔑 JWT Authentication
🛡️ CORS + Security


### 🚀 Quick Start
**Prerequisites**

```bash
node -v  # Requires Node.js 16+
mongod --version  # MongoDB required

```

**Installation & Setup**
```bash
# Clone and setup
git clone https://github.com/yourusername/taskflow.git
cd taskflow

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start development servers
npm run dev &  # Frontend (http://localhost:3000)
npm run server  # Backend (http://localhost:5000)

```

**Environment Variables**

```bash
VITE_API_BASE_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key

```

### 🎯 Usage
**Demo Account**

```bash
Email: demo@example.com
Password: demopassword123
```

### Key Features in Action
```bash
# Create a new task
📝 Click "New Task" → Fill details → Save

# Filter tasks
🔍 Use search bar → Apply filters → Bulk actions

# Manage workflow
🔄 Drag tasks → Change status → Add tags → Set due dates

```

### 📁 Project Structure

```bash

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

```

### 🎨 Components Overview
**Core Components**

- Component	Purpose
- Dashboard	Main task overview with stats
- TaskList	Display and manage tasks
- TaskForm	Create/edit task modal
- TaskItem	Individual task card
- SearchFilter	Advanced filtering

### Auth Components
- Component	Purpose
- Login	User authentication
- Register	New user signup
- ForgotPassword	Password recovery
- ProtectedRoute	Route protection

### 🔌 API Endpoints
**Authentication**

```bash
POST /api/auth/register    # Create account
POST /api/auth/login       # User login
GET  /api/auth/me         # Current user
```

**Tasks**
```bash
GET    /api/tasks         # Get tasks (with filters)
POST   /api/tasks         # Create task
PUT    /api/tasks/:id     # Update task
DELETE /api/tasks/:id     # Delete task
```

### 🎨 Styling & Design
**Custom CSS Classes**

```bash
.btn-primary    /* Gradient action buttons */
.card-glass    /* Glass morphism containers */
.input-modern  /* Modern form inputs */
.animate-float /* Floating animations */
```

### 🚀 Deployment
**Frontend (Render)**
```bash
npm run build
render --prod
```

**Backend**
```bash
npm run build
render
```

### Production Environment
```bash
NODE_ENV=production
MONGODB_URI=your-production-db
JWT_SECRET=your-production-secret
```


### 🤝 Contributing

<div align="center">

**We love contributions! Here's how to help:**
- 🍴 Fork the repo
- 🌿 Create a feature branch: git checkout -b feature/amazing-feature
- 💾 Commit changes: git commit -m 'Add amazing feature'
- 📤 Push to branch: git push origin feature/amazing-feature
- 🔀 Open a Pull Request


## 📝 License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


### 🆘 Support
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@taskflow.app

<div align="center">
TaskFlow - Organize your work, amplify your productivity ✨
</div>

<div align="center">

### Made with ❤️ by [SUMIT](https://github.com/Sumit1003)
[![GitHub Follow](https://img.shields.io/github/followers/Sumit1003?label=Follow%20Me&style=social)](https://github.com/Sumit1003)


</div>
