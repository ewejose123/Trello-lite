# 🚀 TaskManager Pro - Full-Stack Task Management Application

A modern, feature-rich task management application built with cutting-edge technologies. This is a **demo project** showcasing full-stack development capabilities with real-time collaboration, file management, and scalable architecture.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with access/refresh tokens
- **Password hashing** with bcrypt
- **Input validation** with express-validator
- **Secure cookie handling**
- **Password requirements**: Minimum 6 characters with at least one letter

### 👥 Team Collaboration
- **Team creation and management**
- **Member invitations** (planned)
- **Role-based permissions** (planned)
- **Real-time team updates**

### 📋 Project Management
- **Project creation** within teams
- **Project descriptions** and metadata
- **Task organization** and categorization
- **Progress tracking**

### ✅ Task Management
- **Task creation and assignment**
- **Status updates** (TODO, IN_PROGRESS, DONE)
- **Due date management**
- **File attachments**
- **Task comments** (planned)

### 📁 File Management
- **Local file storage** (development)
- **Supabase integration** (production ready)
- **Drag & drop uploads**
- **File type validation**
- **Secure file serving**

### 🎨 Modern UI/UX
- **Dark theme** with beautiful gradients
- **Responsive design** for all devices
- **Smooth animations** with Framer Motion
- **Interactive components** with hover effects
- **Toast notifications** for user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - Modern database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Database & Storage
- **PostgreSQL** - Primary database
- **Prisma Migrate** - Database migrations
- **Local file storage** - Development environment
- **Supabase Storage** - Production file storage (ready)

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service development
- **GitHub Actions** - CI/CD pipeline (planned)
- **AWS Lambda** - Serverless functions (planned)
- **AWS S3** - Alternative file storage (planned)
- **Vercel/Netlify** - Frontend deployment (planned)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (planned)
- **Commitizen** - Conventional commits (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskmanager-pro.git
   cd taskmanager-pro
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npx prisma migrate dev
   npm run dev
   ```

4. **Setup frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

## 📁 Project Structure

```
taskmanager-pro/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   └── prisma/         # Database schema
│   ├── uploads/            # Local file storage
│   └── Dockerfile          # Backend container
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── docker-compose.yml      # Development environment
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=8000
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5173
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🧪 Testing the Application

### Demo Features to Test

1. **User Registration & Login**
   - Create a new account
   - Login with credentials
   - Test password validation

2. **Team Management**
   - Create a new team
   - View team details
   - Navigate between teams

3. **Project Creation**
   - Create projects within teams
   - Add project descriptions
   - View project lists

4. **Task Management**
   - Create tasks with descriptions
   - Update task statuses
   - Assign due dates

5. **File Uploads**
   - Upload various file types
   - Drag & drop functionality
   - File attachment to tasks

6. **Navigation & UI**
   - Dark theme consistency
   - Responsive design
   - Smooth animations

## 🚧 Planned Features

### Phase 2 (Next Sprint)
- **Real-time collaboration** with WebSockets
- **Email notifications** for task updates
- **Advanced search** and filtering
- **Task templates** and recurring tasks
- **Time tracking** and reporting

### Phase 3 (Future)
- **Mobile app** (React Native)
- **Advanced analytics** dashboard
- **Integration APIs** (Slack, GitHub, etc.)
- **Multi-language support**
- **Advanced permissions** system

## 🤝 Contributing

This is a demo project, but contributions are welcome! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Prisma** for the excellent ORM
- **Tailwind CSS** for the beautiful design system
- **Framer Motion** for smooth animations
- **Lucide** for the beautiful icons
- **React Hot Toast** for user feedback

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using modern web technologies**
