# AI Learning App - MERN Backend Setup Guide

## Overview
This is the backend for the AI Learning App built with Node.js, Express, and MongoDB.

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
npm install
```

This will install:
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### 2. Setup Environment Variables
Create a `.env` file in the server directory with:
```
MONGO_URI=mongodb://localhost:27017/ai-learning
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas** (Cloud):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-learning?retryWrites=true&w=majority
```

### 3. Start MongoDB

**Local MongoDB**:
```bash
mongod
```

**MongoDB Atlas**: No action needed, connection handled via URI

### 4. Start the Server

**Development** (with hot reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Register
**POST** `/api/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "teacher"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49c1234567890abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### 2. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as register

#### 3. Verify Token
**GET** `/api/auth/verify`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49c1234567890abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## File Structure
```
server/
├── controllers/
│   └── authController.js      # Authentication logic
├── middleware/
│   └── auth.js                # JWT verification
├── models/
│   └── User.js                # MongoDB User schema
├── routes/
│   └── auth.js                # Authentication routes
├── server.js                  # Main server file
├── .env                       # Environment variables
└── package.json
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'teacher']),
  createdAt: Date
}
```

## Security Features
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens valid for 7 days
- Protected routes require Bearer token
- CORS enabled for frontend communication

## Frontend Integration

The frontend makes API calls to:
- `http://localhost:5000/api/auth/register`
- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/auth/verify`

Tokens are stored in localStorage and included in request headers:
```
Authorization: Bearer {token}
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running locally OR
- Check MONGO_URI in .env for Atlas connection

### CORS Error
- Frontend is on `http://localhost:3000`
- Server has CORS enabled for all origins in development

### Token Expired
- Tokens expire in 7 days
- User must login again to get a new token

## Next Steps
1. Add more routes (courses, assignments)
2. Add database validation
3. Add rate limiting
4. Add logging
5. Deploy to production (Heroku, AWS, etc.)

## Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Mongoose Documentation](https://mongoosejs.com/)
