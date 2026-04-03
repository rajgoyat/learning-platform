# AI-Learning Application - Setup & Deployment Guide

## ✅ Issues Fixed

### 1. **App.js Import Paths** ✅
Fixed incorrect import paths in `ai-learning/src/App.js`:
- Changed `./src/App.css` → `./App.css`
- Changed `./src/Auth.css` → `./css/Auth.css`

### 2. **MongoDB Database Configuration** ✅
Updated `.env` file to use "learning" database:
```
MONGO_URI=mongodb+srv://rajgoyat618_db_user:11fACi5rtB4RvRGT@cluster0.dbqzrsi.mongodb.net/learning?appName=Cluster0
```

---

## 📋 Project Structure

```
ai-learning/
├── Client (React App)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # Auth context
│   │   ├── css/                 # Stylesheets
│   │   ├── utils/               # API utilities
│   │   └── Routes/              # Routes configuration
│   └── package.json
└── Server (Node.js/Express)
    ├── controllers/             # Business logic
    ├── middleware/              # Auth middleware
    ├── models/                  # MongoDB models
    ├── routes/                  # API routes
    ├── .env                     # Environment variables
    └── server.js                # Main server file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify `.env` file** (should contain):
   ```
   MONGO_URI=mongodb+srv://rajgoyat618_db_user:11fACi5rtB4RvRGT@cluster0.dbqzrsi.mongodb.net/learning?appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start server**
   ```bash
   npm run dev
   ```
   Expected output: `Server running on port 5000` and `MongoDB connected`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ai-learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React app**
   ```bash
   npm start
   ```
   Opens automatically at `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token (Protected)

### Courses
- `GET /api/courses` - Get all courses (Protected)
- `POST /api/courses` - Create course (Protected, Teacher only)
- `GET /api/courses/mine` - Get teacher's courses (Protected)
- `GET /api/courses/:id` - Get course by ID (Protected)
- `DELETE /api/courses/:id` - Delete course (Protected)

### Health Check
- `GET /api/health` - Server health status

---

## 🗄️ Database Collections

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'teacher',
  createdAt: Date
}
```

### Courses Collection
```javascript
{
  title: String,
  description: String,
  concept: String,
  contentType: 'Video' | 'PDF' | 'Notes',
  videoUrl: String,
  teacher: ObjectId (ref: User),
  teacherName: String,
  status: 'Active' | 'Draft',
  modules: Number,
  studentsEnrolled: Number,
  timestamps: true
}
```

---

## 🔐 Authentication Flow

1. User registers/logs in on frontend
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token sent in `Authorization: Bearer <token>` header for protected routes
5. Backend validates token using middleware

---

## 🎯 Features

### Student Features
- Browse all courses
- View course details
- Track assignments
- Save courses
- View progress

### Teacher Features
- Create courses
- Manage courses (Edit/Delete)
- View enrolled students
- Add course content
- Set course status

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify internet connection
- Check MongoDB Atlas cluster is active
- Confirm credentials in .env
- Ensure IP is whitelisted in MongoDB Atlas

### API Connection Error
- Ensure backend server is running on port 5000
- Check CORS is enabled (it is by default)
- Verify API_URL in frontend matches backend

### Import/Module Errors
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clear React cache: `npm start -- --reset-cache`

### CSS Not Loading
- Hard refresh browser: `Ctrl+Shift+R`
- Clear browser cache
- Verify CSS file paths

---

## 📝 Notes

- JWT tokens expire in 7 days
- Password minimum length: 6 characters
- Email validation is enforced
- All API responses include success flag and data/error messages

---

## ✨ Next Steps

1. Test authentication (register/login)
2. Create test courses
3. Verify course display on dashboards
4. Test course deletion
5. Deploy to production when ready

---

Last Updated: April 2, 2026
