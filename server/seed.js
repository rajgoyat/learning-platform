const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Teacher profiles
const teachers = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
  {
    name: 'Prof. Michael Chen',
    email: 'michael.chen@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
  {
    name: 'Prof. James Wilson',
    email: 'james.wilson@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
  {
    name: 'Prof. David Martinez',
    email: 'david.martinez@edutech.com',
    password: 'Teacher@123',
    role: 'teacher',
  },
];

// Course seed data (single video link per course)
const courses = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Learn JavaScript from scratch. Understand variables, functions, promises, async/await, and ES6+ features.',
    concept: 'JavaScript Basics',
    videoUrl: 'https://youtube.com/watch?v=DHvZLI7Diuc',
    imageUrl: 'https://img.youtube.com/vi/DHvZLI7Diuc/maxresdefault.jpg',
  },
  {
    title: 'React & Modern Web Development',
    description: 'Master React, Hooks, State Management, and build production-ready applications with Next.js.',
    concept: 'Frontend Development',
    videoUrl: 'https://youtu.be/bMknfKXILEI',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800',
  },
  {
    title: 'Python for Data Science',
    description: 'Complete guide to Python with NumPy, Pandas, Matplotlib, and Scikit-learn for data analysis.',
    concept: 'Data Science',
    videoUrl: 'https://youtube.com/watch?v=LHBE6Q9XlzI',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f5e24e5a14d?w=800',
  },
  {
    title: 'Web Design Principles & CSS',
    description: 'Learn responsive design, CSS Grid, Flexbox, animations, and UX/UI best practices.',
    concept: 'Web Design',
    videoUrl: 'https://youtu.be/yfoY53QXEnY',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
  },
  {
    title: 'Node.js & Express Backend Development',
    description: 'Build scalable server-side applications using Node.js, Express, MongoDB, and REST APIs.',
    concept: 'Backend Development',
    videoUrl: 'https://youtube.com/watch?v=Oe421EPjeBE',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  },
  {
    title: 'Machine Learning with TensorFlow',
    description: 'Deep dive into machine learning, neural networks, CNNs, and practical TensorFlow projects.',
    concept: 'AI/ML',
    videoUrl: 'https://youtu.be/tPYj3fFJuZ8',
    imageUrl: 'https://images.unsplash.com/photo-1555949519-2f4ae214308c?w=800',
  },
  {
    title: 'Database Design & SQL Mastery',
    description: 'SQL basics, advanced queries, indexing, transactions, and database optimization techniques.',
    concept: 'Databases',
    videoUrl: 'https://youtube.com/watch?v=4cWkiAagI7c',
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-3efca4275914?w=800',
  },
  {
    title: 'Mobile Development with React Native',
    description: 'Build cross-platform mobile applications for iOS and Android using React Native.',
    concept: 'Mobile Development',
    videoUrl: 'https://youtu.be/ur6I5GQvWQA',
    imageUrl: 'https://images.unsplash.com/photo-1512941691920-ab4dd0cf0055?w=800',
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'AWS fundamentals, EC2, S3, Lambda, RDS, and deploying scalable cloud applications.',
    concept: 'Cloud Computing',
    videoUrl: 'https://youtube.com/watch?v=ZvnoubgpWBc',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
  },
  {
    title: 'Docker & Kubernetes Deployment',
    description: 'Container orchestration, microservices, CI/CD pipelines, and production deployment strategies.',
    concept: 'DevOps',
    videoUrl: 'https://youtu.be/3c-iBn73dDE',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-aabf4c0d7541?w=800',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing users and courses');

    // Create teacher profiles (using create() to trigger password hashing middleware)
    const createdTeachers = await Promise.all(
      teachers.map(teacher => User.create(teacher))
    );
    console.log(`✓ Created ${createdTeachers.length} teacher profiles`);

    // Create test student account
    await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'Student@123',
      role: 'student',
    });
    console.log('✓ Created test student account');

    // Create courses and assign to teachers in rotation
    const coursesToCreate = courses.map((course, index) => ({
      title: course.title,
      description: course.description,
      concept: course.concept,
      videoUrl: course.videoUrl,
      imageUrl: course.imageUrl || '',
      teacher: createdTeachers[index % createdTeachers.length]._id,
      teacherName: createdTeachers[index % createdTeachers.length].name,
      status: 'Published',
    }));

    const createdCourses = await Course.insertMany(coursesToCreate);
    console.log(`✓ Created ${createdCourses.length} courses`);

    // Print summary
    console.log('\n=== SEED SUMMARY ===');
    console.log(`Total Teachers: ${createdTeachers.length}`);
    console.log(`Total Courses: ${createdCourses.length}`);
    console.log('\nTeacher Accounts:');
    createdTeachers.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ${teacher.name} (${teacher.email})`);
    });
    console.log('\nCourse Format:');
    console.log(`  - Single Video Courses: ${createdCourses.length}`);
    console.log('\n=== Login Credentials ===');
    console.log('Username: (email from list above)');
    console.log('Password: Teacher@123');
    console.log('\nStudent Test Account:');
    console.log('Email: student@test.com');
    console.log('Password: Student@123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();


