# 📚 AI Learning Platform - Sample Data Setup Guide

## ✅ Database Seeded Successfully!

Your database has been populated with **20 diverse courses** and **6 teacher profiles** plus **1 test student account**.

---

## 👨‍🏫 Teacher Login Credentials

All teachers use password: **`Teacher@123`**

| # | Name | Email |
|---|------|-------|
| 1 | Dr. Sarah Johnson | sarah.johnson@edutech.com |
| 2 | Prof. Michael Chen | michael.chen@edutech.com |
| 3 | Dr. Emily Rodriguez | emily.rodriguez@edutech.com |
| 4 | Prof. James Wilson | james.wilson@edutech.com |
| 5 | Dr. Priya Sharma | priya.sharma@edutech.com |
| 6 | Prof. David Martinez | david.martinez@edutech.com |

---

## 👤 Student Login Credentials

- **Email:** `student@test.com`
- **Password:** `Student@123`

---

## 📖 20 Courses Created

### Video Courses (17) - YouTube Links

1. **JavaScript Fundamentals**
   - Type: Video | Teacher: Dr. Sarah Johnson
   - Topics: Variables, Functions, Promises, Async/Await, ES6+
   - Modules: 8

2. **React & Modern Web Development**
   - Type: Video | Teacher: Prof. Michael Chen
   - Topics: React Hooks, State Management, Next.js
   - Modules: 12

3. **Python for Data Science**
   - Type: Video | Teacher: Dr. Emily Rodriguez
   - Topics: NumPy, Pandas, Matplotlib, Scikit-learn
   - Modules: 15

4. **Web Design Principles & CSS**
   - Type: Video | Teacher: Prof. James Wilson
   - Topics: Responsive Design, CSS Grid, Flexbox, Animations
   - Modules: 10

5. **Node.js & Express Backend Development**
   - Type: Video | Teacher: Dr. Priya Sharma
   - Topics: Server-side Apps, Express, MongoDB, REST APIs
   - Modules: 14

6. **Machine Learning with TensorFlow**
   - Type: Video | Teacher: Prof. David Martinez
   - Topics: Neural Networks, CNNs, TensorFlow Projects
   - Modules: 16

7. **Database Design & SQL Mastery**
   - Type: Video | Teacher: Dr. Sarah Johnson
   - Topics: SQL Queries, Indexing, Transactions, Optimization
   - Modules: 11

8. **Mobile Development with React Native**
   - Type: Video | Teacher: Prof. Michael Chen
   - Topics: Cross-platform Apps for iOS/Android
   - Modules: 12

9. **Cloud Computing with AWS**
   - Type: Video | Teacher: Dr. Emily Rodriguez
   - Topics: EC2, S3, Lambda, RDS, Deployment
   - Modules: 13

10. **Docker & Kubernetes Deployment**
    - Type: Video | Teacher: Prof. James Wilson
    - Topics: Containers, Microservices, CI/CD, DevOps
    - Modules: 10

11. **Vue.js Complete Guide**
    - Type: Video | Teacher: Dr. Priya Sharma
    - Topics: Vue 3, Vuex, Vue Router, Composition API
    - Modules: 11

12. **Angular Framework Mastery**
    - Type: Video | Teacher: Prof. David Martinez
    - Topics: Enterprise Development, RxJS, Dependency Injection
    - Modules: 14

13. **GraphQL API Development**
    - Type: Video | Teacher: Dr. Sarah Johnson
    - Topics: Apollo Server, Subscriptions, Best Practices
    - Modules: 9

14. **Cybersecurity Fundamentals**
    - Type: Video | Teacher: Prof. Michael Chen
    - Topics: Network Security, Encryption, Penetration Testing
    - Modules: 12

15. **UI/UX Design Principles**
    - Type: Video | Teacher: Dr. Emily Rodriguez
    - Topics: Design Thinking, Wireframing, Prototyping, Figma
    - Modules: 8

16. **Testing & Quality Assurance**
    - Type: Video | Teacher: Prof. James Wilson
    - Topics: Unit Testing, Jest, Cypress, TDD
    - Modules: 7

17. **AI & Natural Language Processing**
    - Type: Video | Teacher: Dr. Priya Sharma
    - Topics: Deep Learning NLP, Sentiment Analysis, Transformers
    - Modules: 15

### PDF-Based Courses (3)

18. **Advanced HTML5 & Semantic Web**
    - Type: PDF | Teacher: Prof. David Martinez
    - Topics: HTML5 Features, Semantic Markup, Accessibility, SEO
    - Modules: 6

19. **Git & Version Control Essentials**
    - Type: PDF | Teacher: Dr. Sarah Johnson
    - Topics: Version Control, Branching, GitHub Workflows
    - Modules: 5

20. **Performance Optimization & Web Performance**
    - Type: PDF | Teacher: Prof. Michael Chen
    - Topics: Page Speed, Lighthouse, Caching, Lazy Loading
    - Modules: 6

---

## 🚀 How to Test the Platform

### 1. Start Both Servers (if not already running)

**Terminal 1 - React Frontend:**
```powershell
cd "d:\My Projects\AI-Learning\ai-learning"
npm start
# Access at http://localhost:3000
```

**Terminal 2 - Express Backend:**
```powershell
cd "d:\My Projects\AI-Learning\server"
node server.js
# Running on port 5000
```

### 2. Login as Student
1. Go to http://localhost:3000
2. Click "Sign Up" → Choose **Student**
3. Use test credentials:
   - Email: `student@test.com`
   - Password: `Student@123`
4. Browse all 20 courses
5. Click any course to view:
   - Video player (YouTube embeds or video player)
   - Course details and description
   - Teacher information
   - Course thumbnail image

### 3. Login as Teacher
1. Go to http://localhost:3000
2. Click "Sign Up" → Choose **Teacher**
3. Use any teacher credentials from the table above
4. You can:
   - View courses you created
   - Create new courses
   - Add video URLs or PDF links
   - Upload course thumbnails
   - Manage course content

---

## 🎯 Key Features Working

✅ **Video Playback**
- YouTube videos with proper embed URLs
- HTML5 video player for direct MP4/WebM files
- Proper iframe with aspect ratio 16:9

✅ **Course Display**
- Course thumbnails with images
- Teacher information
- Course descriptions and modules
- Content type indicators (Video/PDF)

✅ **Student Dashboard**
- Browse all published courses
- Click courses to view details in modal
- Course modal with full video player

✅ **Teacher Dashboard**
- Create new courses
- Add YouTube links or PDF URLs
- Upload thumbnail images
- Manage course content

---

## 📝 Notes

- All courses are in **Published** status and visible to students
- Courses are distributed across 6 different teachers
- YouTube URLs are correctly converted to embed format
- PDF courses have placeholder URLs (you can update them)
- Each teacher can only see/manage their own courses
- Students can see all published courses from all teachers

---

## 🔄 Re-seeding Database (Optional)

If you want to reset and re-seed the database:

```powershell
cd "d:\My Projects\AI-Learning\server"
node seed.js
```

This will:
1. Delete all existing users and courses
2. Create 6 new teacher profiles
3. Create 20 new courses
4. Create a test student account

---

**Happy Learning! 🎓**
