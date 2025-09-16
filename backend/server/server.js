const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(cors({
  origin: [
    "https://unione-f.netlify.app",
    "https://www.myunione.in",
    "https://myunione.in"
  ],
  credentials: true
}));
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./school.db');

// Initialize database and create tables
db.serialize(() => {
  // Users table (teachers and parents)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('teacher', 'parent', 'management')),
      name TEXT NOT NULL,
      phone TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      parent_contact TEXT NOT NULL,
      parent_id INTEGER,
      admission_date TEXT DEFAULT (date('now')),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id)
    )
  `);

  // Teachers table
  db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      subjects TEXT,
      classes TEXT,
      experience INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      hire_date TEXT DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // NEW: Assignments table
  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      teacher_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      subject TEXT NOT NULL,
      class_grade TEXT,
      student_id INTEGER,
      due_date TEXT NOT NULL,
      total_marks INTEGER DEFAULT 100,
      assignment_type TEXT DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'project', 'test', 'quiz', 'lab')),
      status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'graded', 'overdue')),
      assigned_date TEXT DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // NEW: Assignment submissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      submission_text TEXT,
      submission_date TEXT DEFAULT (date('now')),
      grade_received INTEGER,
      feedback TEXT,
      status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(assignment_id, student_id)
    )
  `);

  // Attendance table
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(student_id, date)
    )
  `);

  // Grades table
  db.run(`
    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
      grade TEXT NOT NULL,
      exam_type TEXT DEFAULT 'regular',
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Feedback table
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Academic Performance table
  db.run(`
    CREATE TABLE IF NOT EXISTS academic_performance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      study_streak INTEGER DEFAULT 0,
      weekly_study_hours DECIMAL(5,2) DEFAULT 0.00,
      monthly_study_hours DECIMAL(6,2) DEFAULT 0.00,
      achievements TEXT DEFAULT '[]',
      class_rank INTEGER,
      total_students_in_class INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(student_id)
    )
  `);

  // Announcements table
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      target_audience TEXT,
      is_published BOOLEAN DEFAULT 0,
      date TEXT DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Library table
  db.run(`
    CREATE TABLE IF NOT EXISTS library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_title TEXT NOT NULL,
      book_isbn TEXT,
      student_id INTEGER,
      student_name TEXT,
      issue_date TEXT,
      return_date TEXT,
      status TEXT DEFAULT 'available' CHECK (status IN ('available', 'issued', 'returned', 'overdue')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Transport table
  db.run(`
    CREATE TABLE IF NOT EXISTS transport (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_name TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      bus_number TEXT NOT NULL,
      students_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Drop the existing schedule_events table if it exists with wrong schema
  db.run(`DROP TABLE IF EXISTS schedule_events`, (err) => {
    if (err) {
      console.log('Note: schedule_events table did not exist or could not be dropped');
    } else {
      console.log('Dropped existing schedule_events table to recreate with correct schema');
    }
    
    // Create schedule_events table with correct schema
    db.run(`
      CREATE TABLE IF NOT EXISTS schedule_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        day TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        location TEXT,
        student_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating schedule_events table:', err);
      } else {
        console.log('Schedule events table created successfully with correct schema');
      }
    });
  });

  // Create fees table
  db.run(`
    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      fee_type TEXT NOT NULL,
      due_date TEXT NOT NULL,
      paid_date TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Insert demo data
  const hashedTeacherPassword = bcrypt.hashSync('teacher123', 10);
  const hashedParentPassword = bcrypt.hashSync('parent123', 10);
  const hashedManagementPassword = bcrypt.hashSync('management123', 10);

  // Insert demo users
  db.run(`
    INSERT OR IGNORE INTO users (email, password, role, name, phone) VALUES 
    ('teacher@demo.com', ?, 'teacher', 'Priya Sanak', '9876543211'),
    ('parent@demo.com', ?, 'parent', 'Swapnil Dedha', '9876543210'),
    ('management@demo.com', ?, 'management', 'Admin User', '9876543215')
  `, [hashedTeacherPassword, hashedParentPassword, hashedManagementPassword]);

  // Insert demo teachers
  db.run(`
    INSERT OR IGNORE INTO teachers (name, email, phone, subjects, classes, experience) VALUES 
    ('Pradeep Patil', 'pradeep.patil@demo.com', '9876543211', 'Mathematics,Physics', '10A,10B,11A', 12),
    ('Anil Verma', 'Anil.verma@demo.com', '9876543212', 'English Literature,Creative Writing', '9A,9B,10C', 8),
    ('Sarika Sharma', 'sarika.sharma@demo.com', '9876543213', 'Chemistry,Biology', '11A,11B,12A', 15)
  `);

  // Insert demo students
  db.run(`
    INSERT OR IGNORE INTO students (name, grade, email, parent_contact, parent_id) VALUES 
    ('Shreyas Verma', '10', 'shreyas.verma@school.com', '9876543210', 2),
    ('Akash Gadade', '9', 'akash.gadade@school.com', '9876543212', 2),
    ('Aniket Salvi', '10', 'aniket.salvi@school.com', '9876543213', 2),
    ('Vedant Raut', '11', 'vedant.raut@school.com', '9876543214', 2),
    ('Rishabh verma', '12', 'rishabh.verma@school.com', '9876543215', 2)
  `);

  // Insert demo assignments
  db.run(`
    INSERT OR IGNORE INTO assignments (id, teacher_id, teacher_name, title, description, subject, class_grade, due_date, total_marks, assignment_type) VALUES 
    (1, 1, 'Priya Sanak', 'Algebra Problem Set', 'Complete exercises 1-20 from Chapter 5: Linear Equations. Show all working steps clearly.', 'Mathematics', '10', '2025-02-01', 50, 'homework'),
    (2, 1, 'Priya Sanak', 'Science Project: Solar System', 'Create a 3D model of the solar system with a detailed report on each planet. Include interesting facts and recent discoveries.', 'Science', '10', '2025-02-15', 100, 'project'),
    (3, 1, 'Priya Sanak', 'English Essay: Climate Change', 'Write a 500-word essay on the impact of climate change on your local community. Include solutions and personal actions.', 'English', '9', '2025-01-25', 25, 'homework'),
    (4, 1, 'Priya Sanak', 'History Research: Ancient Civilizations', 'Research and present findings on one ancient civilization of your choice. Focus on their contributions to modern society.', 'History', '11', '2025-02-10', 75, 'project'),
    (5, 1, 'Priya Sanak', 'Physics Lab Report', 'Complete the pendulum experiment and submit a detailed lab report with observations, calculations, and conclusions.', 'Physics', '11', '2025-01-30', 40, 'lab')
  `);

  // Insert demo assignment submissions
  db.run(`
    INSERT OR IGNORE INTO assignment_submissions (assignment_id, student_id, student_name, submission_text, grade_received, feedback, status) VALUES 
    (1, 1, 'Shreyas Verma', 'Completed all 20 exercises with detailed solutions showing each step of solving linear equations.', 45, 'Excellent work! Clear methodology and accurate calculations. Keep it up!', 'graded'),
    (1, 3, 'Aniket Salvi', 'Completed exercises 1-18, having difficulty with questions 19-20.', 40, 'Good progress! Please see me after class for help with the challenging problems.', 'graded'),
    (2, 1, 'Shreyas Verma', 'Created detailed 3D model with comprehensive report covering all planets and recent Mars discoveries.', 95, 'Outstanding project! Excellent attention to detail and research quality.', 'graded')
  `);

  // Insert demo academic performance data
  db.run(`
    INSERT OR IGNORE INTO academic_performance (student_id, study_streak, weekly_study_hours, monthly_study_hours, achievements, class_rank, total_students_in_class) VALUES 
    (1, 12, 25.5, 102.0, '["Excellence in Mathematics", "Perfect Attendance Award", "Science Fair Winner"]', 3, 30),
    (2, 8, 18.0, 72.0, '["Creative Writing Award", "Literature Club President"]', 8, 28),
    (3, 15, 30.0, 120.0, '["Academic Excellence", "Student of the Month", "Math Olympiad Qualifier"]', 2, 30),
    (4, 10, 22.0, 88.0, '["Leadership Award", "Chemistry Lab Assistant"]', 5, 25),
    (5, 20, 35.0, 140.0, '["Valedictorian Candidate", "National Honor Society", "University Scholarship"]', 1, 22)
  `);

  // Insert demo announcements
  db.run(`
    INSERT OR IGNORE INTO announcements (title, content, priority, category, author, target_audience, is_published) VALUES 
    ('Annual Sports Day - February 15th', 'We are excited to announce our Annual Sports Day! All students are encouraged to participate.', 'high', 'Events', 'Principal Johnson', 'students,parents', 1),
    ('Parent-Teacher Conference Scheduled', 'Parent-Teacher conferences have been scheduled for January 25-27.', 'urgent', 'Academic', 'Academic Coordinator', 'parents,teachers', 1),
    ('Transportation Route Changes', 'Due to road construction on Maple Street, Bus Route #7 will be temporarily modified.', 'medium', 'Transportation', 'Transport Manager', 'students,parents', 0)
  `);

  // Insert demo library records
  db.run(`
    INSERT OR IGNORE INTO library (book_title, book_isbn, student_name, issue_date, status) VALUES 
    ('Advanced Mathematics', '978-0123456789', 'Emma Smith', '2025-01-01', 'issued'),
    ('Physics Fundamentals', '978-0123456790', 'Jake Wilson', '2024-12-15', 'returned'),
    ('Chemistry Basics', '978-0123456791', 'Lily Brown', '2025-01-10', 'issued')
  `);

  // Insert demo transport routes
  db.run(`
    INSERT OR IGNORE INTO transport (route_name, driver_name, bus_number, students_count) VALUES 
    ('Route A - Downtown', 'John Martinez', 'BUS-001', 45),
    ('Route B - Suburbs', 'Sarah Williams', 'BUS-002', 38),
    ('Route C - East Side', 'Mike Johnson', 'BUS-003', 42)
  `);

  // Insert demo attendance
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  db.run(`
    INSERT OR IGNORE INTO attendance (student_id, date, status) VALUES 
    (1, '${today.toISOString().split('T')[0]}', 'present'),
    (2, '${today.toISOString().split('T')[0]}', 'present'),
    (3, '${today.toISOString().split('T')[0]}', 'late'),
    (4, '${today.toISOString().split('T')[0]}', 'present'),
    (5, '${today.toISOString().split('T')[0]}', 'absent'),
    (1, '${yesterday.toISOString().split('T')[0]}', 'present'),
    (2, '${yesterday.toISOString().split('T')[0]}', 'absent'),
    (3, '${yesterday.toISOString().split('T')[0]}', 'present')
  `);

  // Insert demo grades
  db.run(`
    INSERT OR IGNORE INTO grades (student_id, subject, score, grade, date) VALUES 
    (1, 'Mathematics', 92, 'A', '2024-01-15'),
    (1, 'Science', 88, 'B+', '2024-01-16'),
    (1, 'English', 95, 'A+', '2024-01-17'),
    (2, 'Mathematics', 85, 'B', '2024-01-15'),
    (2, 'Science', 78, 'B-', '2024-01-16'),
    (2, 'English', 82, 'B', '2024-01-17'),
    (3, 'Mathematics', 90, 'A-', '2024-01-15'),
    (3, 'Science', 93, 'A', '2024-01-16'),
    (3, 'English', 87, 'B+', '2024-01-17')
  `);

  // Insert demo feedback
  db.run(`
    INSERT OR IGNORE INTO feedback (student_id, subject, message, rating, date) VALUES 
    (1, 'Mathematics', 'Shreyas shows excellent problem-solving skills and is always eager to learn new concepts.', 5, '2024-01-20'),
    (1, 'Science', 'Great participation in lab experiments. Keep up the good work!', 4, '2024-01-21'),
    (2, 'Mathematics', 'Akash has improved significantly this term. Needs to work on homework consistency.', 3, '2024-01-20'),
    (3, 'English', 'Aniket has excellent writing skills and contributes well to class discussions.', 5, '2024-01-22')
  `);

  // Insert demo schedule events after table creation
  setTimeout(() => {
    db.run(`
      INSERT OR IGNORE INTO schedule_events (subject, day, start_time, end_time, location, student_id, notes) VALUES 
      ('Mathematics', 'Monday', '09:00', '09:45', 'Room 101', NULL, 'General Mathematics class for all students'),
      ('Science', 'Monday', '10:00', '10:45', 'Lab 1', NULL, 'Physics - Motion and Force'),
      ('English', 'Monday', '11:00', '11:45', 'Room 102', NULL, 'Literature - Shakespeare'),
      ('Mathematics', 'Tuesday', '09:00', '09:45', 'Room 101', 1, 'Special tutoring for Shreyas Verma'),
      ('Science', 'Tuesday', '10:00', '10:45', 'Lab 1', NULL, 'Chemistry - Elements for all students'),
      ('Physical Education', 'Wednesday', '14:00', '15:00', 'Gymnasium', NULL, 'Sports activities'),
      ('Computer Science', 'Thursday', '11:00', '12:00', 'Computer Lab', 2, 'Programming basics for Akash Gadade'),
      ('Art', 'Friday', '13:00', '14:00', 'Art Room', NULL, 'Creative arts session')
    `, (err) => {
      if (err) {
        console.log('Demo schedule data already exists or error:', err.message);
      } else {
        console.log('Demo schedule data inserted successfully');
      }
    });
  }, 2000);

  // Insert demo fees
  db.run(`
    INSERT OR IGNORE INTO fees (student_id, amount, fee_type, due_date, status) VALUES 
    (1, 2500.00, 'Tuition Fee', '2025-03-01', 'pending'),
    (2, 2500.00, 'Tuition Fee', '2025-03-01', 'paid'),
    (3, 2500.00, 'Tuition Fee', '2025-03-01', 'pending'),
    (4, 2500.00, 'Tuition Fee', '2025-03-01', 'paid'),
    (5, 2500.00, 'Tuition Fee', '2025-03-01', 'overdue'),
    (1, 500.00, 'Library Fee', '2025-02-15', 'paid'),
    (2, 500.00, 'Library Fee', '2025-02-15', 'pending')
  `);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Management authorization middleware
const requireManagement = (req, res, next) => {
  if (req.user.role !== 'management') {
    return res.status(403).json({ error: 'Management access required' });
  }
  next();
};

// Teacher or Management authorization middleware
const requireTeacherOrManagement = (req, res, next) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Teacher or Management access required' });
  }
  next();
};

// Get letter grade helper function
const getLetterGrade = (score) => {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 65) return 'D';
  return 'F';
};

// ASSIGNMENTS API ROUTES

// Get assignments (for teachers - all assignments they created, for parents - assignments for their children)
app.get('/api/assignments', authenticateToken, (req, res) => {
  console.log('GET /api/assignments - User role:', req.user.role, 'User ID:', req.user.id);
  
  if (req.user.role === 'parent') {
    // For parents, get assignments for their children
    db.all(
      `SELECT a.*, 
              CASE WHEN a.student_id IS NOT NULL THEN s.name ELSE 'Class Assignment' END as target_name,
              COALESCE(sub.status, 'not_submitted') as submission_status,
              sub.grade_received,
              sub.submission_date,
              sub.feedback as submission_feedback
       FROM assignments a 
       LEFT JOIN students s ON a.student_id = s.id 
       LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND s.id = sub.student_id
       WHERE (a.student_id IS NOT NULL AND s.parent_id = ?) 
             OR (a.student_id IS NULL AND EXISTS (
                SELECT 1 FROM students st WHERE st.parent_id = ? AND st.grade = a.class_grade
             ))
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [req.user.id, req.user.id],
      (err, assignments) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log('Parent assignments found:', assignments.length);
        res.json(assignments);
      }
    );
  } else if (req.user.role === 'teacher' || req.user.role === 'management') {
    // For teachers/management, get all assignments (teachers see their own, management sees all)
    let query = `
      SELECT a.*, 
             CASE WHEN a.student_id IS NOT NULL THEN s.name ELSE ('Class ' || a.class_grade) END as target_name,
             COUNT(sub.id) as submission_count,
             COUNT(CASE WHEN sub.status = 'graded' THEN 1 END) as graded_count
      FROM assignments a 
      LEFT JOIN students s ON a.student_id = s.id 
      LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id
    `;
    
    const params = [];
    
    if (req.user.role === 'teacher') {
      query += ' WHERE a.teacher_id = ?';
      params.push(req.user.id);
    }
    
    query += `
      GROUP BY a.id, a.teacher_id, a.teacher_name, a.title, a.description, a.subject, 
               a.class_grade, a.student_id, a.due_date, a.total_marks, a.assignment_type, 
               a.status, a.assigned_date, a.created_at, s.name
      ORDER BY a.due_date ASC, a.created_at DESC
    `;

    db.all(query, params, (err, assignments) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Teacher/Management assignments found:', assignments.length);
      res.json(assignments);
    });
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
});

// Get assignments for a specific student (for parent dashboard)
app.get('/api/assignments/student/:studentId', authenticateToken, (req, res) => {
  const { studentId } = req.params;
  console.log('GET /api/assignments/student/:studentId - Student ID:', studentId, 'User role:', req.user.role);
  
  // Validate studentId
  if (!studentId || isNaN(parseInt(studentId))) {
    return res.status(400).json({ error: 'Invalid student ID provided' });
  }

  // Check access permissions
  if (req.user.role === 'parent') {
    // Parents can only access their own children's assignments
    db.get(
      'SELECT * FROM students WHERE id = ? AND parent_id = ?',
      [studentId, req.user.id],
      (err, student) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!student) {
          return res.status(403).json({ error: 'Access denied' });
        }
        fetchStudentAssignments();
      }
    );
  } else {
    // Teachers and management can access all student assignments
    fetchStudentAssignments();
  }
  
  function fetchStudentAssignments() {
    db.all(
      `SELECT a.*, 
              s.name as student_name,
              s.grade as student_grade,
              COALESCE(sub.status, 'not_submitted') as submission_status,
              sub.grade_received,
              sub.submission_date,
              sub.feedback as submission_feedback,
              sub.submission_text
       FROM assignments a 
       JOIN students s ON s.id = ?
       LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = ?
       WHERE (a.student_id = ? OR (a.student_id IS NULL AND a.class_grade = s.grade))
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [studentId, studentId, studentId],
      (err, assignments) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log('Student assignments found:', assignments.length);
        res.json(assignments);
      }
    );
  }
});

// Create new assignment (teachers only) - IMPROVED VERSION
app.post('/api/assignments', authenticateToken, requireTeacherOrManagement, (req, res) => {
  console.log('POST /api/assignments - User:', req.user.role, 'User ID:', req.user.id, 'Request body:', req.body);
  
  const { 
    title, 
    description, 
    subject, 
    class_grade, 
    student_id, 
    due_date, 
    total_marks, 
    assignment_type 
  } = req.body;

  // Validate required fields
  if (!title || !description || !subject || !due_date) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Title, description, subject, and due date are required'
    });
  }

  // Validate title and description length
  if (title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  
  if (description.trim().length === 0) {
    return res.status(400).json({ error: 'Description cannot be empty' });
  }

  // Validate that either class_grade or student_id is provided (but not both)
  if (!class_grade && !student_id) {
    console.log('Validation failed: Neither class_grade nor student_id provided');
    return res.status(400).json({ 
      error: 'Assignment target required',
      details: 'Either a class or specific student must be selected'
    });
  }

  if (class_grade && student_id) {
    console.log('Validation failed: Both class_grade and student_id provided');
    return res.status(400).json({ 
      error: 'Invalid assignment target',
      details: 'Please select either a class OR a specific student, not both'
    });
  }

  // Validate due date format and ensure it's not in the past
  const dueDateObj = new Date(due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  
  if (isNaN(dueDateObj.getTime())) {
    return res.status(400).json({ error: 'Invalid due date format' });
  }
  
  if (dueDateObj < today) {
    return res.status(400).json({ error: 'Due date cannot be in the past' });
  }

  // Validate total marks
  if (total_marks && (isNaN(total_marks) || total_marks <= 0 || total_marks > 1000)) {
    return res.status(400).json({ 
      error: 'Invalid total marks',
      details: 'Total marks must be a number between 1 and 1000'
    });
  }

  // Validate assignment type
  const validTypes = ['homework', 'project', 'test', 'quiz', 'lab'];
  if (assignment_type && !validTypes.includes(assignment_type)) {
    return res.status(400).json({ 
      error: 'Invalid assignment type',
      details: `Assignment type must be one of: ${validTypes.join(', ')}`
    });
  }

  // Ensure user info is available from JWT
  if (!req.user.id || !req.user.name) {
    console.error('User information missing from JWT token');
    return res.status(500).json({ 
      error: 'Authentication error',
      details: 'User information is missing. Please log in again.'
    });
  }

  // If specific student is selected, validate student exists
  if (student_id) {
    const studentIdNum = parseInt(student_id);
    if (isNaN(studentIdNum)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }
    
    db.get('SELECT id, grade, name FROM students WHERE id = ?', [studentIdNum], (err, student) => {
      if (err) {
        console.error('Database error checking student:', err);
        return res.status(500).json({ 
          error: 'Database error',
          details: 'Failed to validate student information'
        });
      }
      if (!student) {
        console.log('Student not found:', studentIdNum);
        return res.status(400).json({ 
          error: 'Invalid student',
          details: 'The selected student does not exist'
        });
      }
      
      console.log('Creating assignment for student:', student.name, 'Grade:', student.grade);
      // Create assignment for specific student (use student's grade for class_grade)
      createAssignment(student.grade, studentIdNum);
    });
  } else {
    // Validate class grade
    const gradeNum = parseInt(class_grade);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 12) {
      return res.status(400).json({ 
        error: 'Invalid class grade',
        details: 'Class grade must be between 1 and 12'
      });
    }
    
    console.log('Creating assignment for class:', class_grade);
    // Create assignment for entire class
    createAssignment(class_grade, null);
  }

  function createAssignment(gradeLevel, specificStudentId) {
    const assignmentData = {
      teacher_id: req.user.id,
      teacher_name: req.user.name,
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      class_grade: gradeLevel,
      student_id: specificStudentId,
      due_date: due_date,
      total_marks: parseInt(total_marks) || 100,
      assignment_type: assignment_type || 'homework'
    };

    console.log('Inserting assignment with data:', assignmentData);

    db.run(
      `INSERT INTO assignments (
        teacher_id, teacher_name, title, description, subject, 
        class_grade, student_id, due_date, total_marks, assignment_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assignmentData.teacher_id,
        assignmentData.teacher_name,
        assignmentData.title,
        assignmentData.description,
        assignmentData.subject,
        assignmentData.class_grade,
        assignmentData.student_id,
        assignmentData.due_date,
        assignmentData.total_marks,
        assignmentData.assignment_type
      ],
      function(err) {
        if (err) {
          console.error('Database insert error:', err);
          return res.status(500).json({ 
            error: 'Failed to create assignment',
            details: 'Database error occurred while saving the assignment'
          });
        }
        
        const assignmentId = this.lastID;
        console.log('Assignment created successfully with ID:', assignmentId);
        
        // Return the complete assignment object
        const newAssignment = {
          id: assignmentId,
          teacher_id: assignmentData.teacher_id,
          teacher_name: assignmentData.teacher_name,
          title: assignmentData.title,
          description: assignmentData.description,
          subject: assignmentData.subject,
          class_grade: assignmentData.class_grade,
          student_id: assignmentData.student_id,
          due_date: assignmentData.due_date,
          total_marks: assignmentData.total_marks,
          assignment_type: assignmentData.assignment_type,
          status: 'assigned',
          assigned_date: new Date().toISOString().split('T')[0],
          target_name: specificStudentId ? 'Individual Student' : `Class ${gradeLevel}`,
          submission_count: 0,
          graded_count: 0
        };
        
        res.status(201).json({ 
          success: true,
          message: 'Assignment created successfully',
          assignment: newAssignment
        });
      }
    );
  }
});

// Update assignment (teachers only)
app.put('/api/assignments/:id', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { id } = req.params;
  const { title, description, subject, class_grade, student_id, due_date, total_marks, assignment_type, status } = req.body;
  
  console.log('PUT /api/assignments/:id - ID:', id, 'Request body:', req.body);

  // Validate required fields
  if (!title || !description || !subject || !due_date) {
    return res.status(400).json({ error: 'Title, description, subject, and due date are required' });
  }

  // Check if assignment exists and user has permission to edit
  db.get('SELECT * FROM assignments WHERE id = ?', [id], (err, assignment) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Teachers can only edit their own assignments, management can edit all
    if (req.user.role === 'teacher' && assignment.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.run(
      `UPDATE assignments 
       SET title = ?, description = ?, subject = ?, class_grade = ?, student_id = ?, 
           due_date = ?, total_marks = ?, assignment_type = ?, status = ?
       WHERE id = ?`,
      [
        title.trim(), 
        description.trim(), 
        subject.trim(), 
        class_grade, 
        student_id, 
        due_date, 
        total_marks || 100, 
        assignment_type || 'homework',
        status || assignment.status,
        id
      ],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update assignment' });
        }

        console.log('Assignment updated, ID:', id);
        res.json({ message: 'Assignment updated successfully' });
      }
    );
  });
});

// Delete assignment (teachers only)
app.delete('/api/assignments/:id', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/assignments/:id - ID:', id);

  // Check if assignment exists and user has permission to delete
  db.get('SELECT * FROM assignments WHERE id = ?', [id], (err, assignment) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Teachers can only delete their own assignments, management can delete all
    if (req.user.role === 'teacher' && assignment.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete assignment and related submissions
    db.serialize(() => {
      db.run('DELETE FROM assignment_submissions WHERE assignment_id = ?', [id]);
      db.run('DELETE FROM assignments WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to delete assignment' });
        }

        console.log('Assignment deleted, ID:', id);
        res.json({ message: 'Assignment deleted successfully' });
      });
    });
  });
});

// Submit assignment (students/parents)
app.post('/api/assignments/:id/submit', authenticateToken, (req, res) => {
  const { id: assignmentId } = req.params;
  const { student_id, submission_text } = req.body;
  
  console.log('POST /api/assignments/:id/submit - Assignment ID:', assignmentId, 'Student ID:', student_id);

  if (!student_id || !submission_text) {
    return res.status(400).json({ error: 'Student ID and submission text are required' });
  }

  // For parents, verify they can submit for this student
  if (req.user.role === 'parent') {
    db.get('SELECT * FROM students WHERE id = ? AND parent_id = ?', [student_id, req.user.id], (err, student) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!student) {
        return res.status(403).json({ error: 'Access denied' });
      }
      submitAssignment(student);
    });
  } else {
    // For teachers/management, get student info
    db.get('SELECT * FROM students WHERE id = ?', [student_id], (err, student) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }
      submitAssignment(student);
    });
  }

  function submitAssignment(student) {
    // Check if assignment exists and student is eligible
    db.get(
      `SELECT a.* FROM assignments a 
       WHERE a.id = ? AND (a.student_id = ? OR (a.student_id IS NULL AND a.class_grade = ?))`,
      [assignmentId, student_id, student.grade],
      (err, assignment) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!assignment) {
          return res.status(404).json({ error: 'Assignment not found or not assigned to this student' });
        }

        // Check if already submitted
        db.get(
          'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?',
          [assignmentId, student_id],
          (err, existingSubmission) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Database error' });
            }

            if (existingSubmission) {
              return res.status(400).json({ error: 'Assignment already submitted' });
            }

            // Determine if submission is late
            const currentDate = new Date().toISOString().split('T')[0];
            const isLate = currentDate > assignment.due_date;
            const submissionStatus = isLate ? 'late' : 'submitted';

            // Insert submission
            db.run(
              `INSERT INTO assignment_submissions (
                assignment_id, student_id, student_name, submission_text, status
              ) VALUES (?, ?, ?, ?, ?)`,
              [assignmentId, student_id, student.name, submission_text.trim(), submissionStatus],
              function(err) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Failed to submit assignment' });
                }

                console.log('Assignment submitted with ID:', this.lastID);
                res.json({ 
                  id: this.lastID, 
                  message: 'Assignment submitted successfully',
                  status: submissionStatus
                });
              }
            );
          }
        );
      }
    );
  }
});

// Grade assignment (teachers only)
app.post('/api/assignments/:id/grade', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { id: assignmentId } = req.params;
  const { student_id, grade_received, feedback } = req.body;
  
  console.log('POST /api/assignments/:id/grade - Assignment ID:', assignmentId, 'Student ID:', student_id);

  if (!student_id || grade_received === undefined) {
    return res.status(400).json({ error: 'Student ID and grade are required' });
  }

  // Validate grade
  if (grade_received < 0 || grade_received > 100) {
    return res.status(400).json({ error: 'Grade must be between 0 and 100' });
  }

  // Update submission with grade
  db.run(
    `UPDATE assignment_submissions 
     SET grade_received = ?, feedback = ?, status = 'graded' 
     WHERE assignment_id = ? AND student_id = ?`,
    [grade_received, feedback || '', assignmentId, student_id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to grade assignment' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      console.log('Assignment graded successfully');
      res.json({ message: 'Assignment graded successfully' });
    }
  );
});

// Academic Performance Routes - EXISTING FUNCTIONALITY
// Get academic performance data for a student
app.get('/api/performance/:studentId', authenticateToken, (req, res) => {
  const { studentId } = req.params;
  
  // Check access permissions
  if (req.user.role === 'parent') {
    // Parents can only access their own children's data
    db.get(
      'SELECT * FROM students WHERE id = ? AND parent_id = ?',
      [studentId, req.user.id],
      (err, student) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!student) {
          return res.status(403).json({ error: 'Access denied' });
        }
        fetchPerformanceData();
      }
    );
  } else {
    // Teachers and management can access all student data
    fetchPerformanceData();
  }
  
  function fetchPerformanceData() {
    db.get(
      `SELECT ap.*, s.name as student_name, s.grade as student_grade 
       FROM academic_performance ap 
       JOIN students s ON ap.student_id = s.id 
       WHERE ap.student_id = ?`,
      [studentId],
      (err, performance) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (performance) {
          // Parse achievements from JSON string
          try {
            performance.achievements = JSON.parse(performance.achievements || '[]');
          } catch (e) {
            performance.achievements = [];
          }
        }
        
        res.json(performance || null);
      }
    );
  }
});

// Add or update academic performance data
app.post('/api/performance', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { student_id, study_streak, weekly_study_hours, monthly_study_hours, achievements, class_rank, total_students_in_class } = req.body;
  
  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }
  
  // Validate numeric fields
  if (study_streak !== undefined && (isNaN(study_streak) || study_streak < 0)) {
    return res.status(400).json({ error: 'Study streak must be a non-negative number' });
  }
  
  if (weekly_study_hours !== undefined && (isNaN(weekly_study_hours) || weekly_study_hours < 0)) {
    return res.status(400).json({ error: 'Weekly study hours must be a non-negative number' });
  }
  
  if (monthly_study_hours !== undefined && (isNaN(monthly_study_hours) || monthly_study_hours < 0)) {
    return res.status(400).json({ error: 'Monthly study hours must be a non-negative number' });
  }
  
  if (class_rank !== undefined && (isNaN(class_rank) || class_rank < 1)) {
    return res.status(400).json({ error: 'Class rank must be a positive number' });
  }
  
  if (total_students_in_class !== undefined && (isNaN(total_students_in_class) || total_students_in_class < 1)) {
    return res.status(400).json({ error: 'Total students in class must be a positive number' });
  }
  
  // Convert achievements to JSON string
  let achievementsJson = '[]';
  if (achievements) {
    try {
      achievementsJson = typeof achievements === 'string' ? achievements : JSON.stringify(achievements);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid achievements format' });
    }
  }
  
  // Check if record exists
  db.get('SELECT id FROM academic_performance WHERE student_id = ?', [student_id], (err, existing) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (existing) {
      // Update existing record
      db.run(
        `UPDATE academic_performance 
         SET study_streak = COALESCE(?, study_streak),
             weekly_study_hours = COALESCE(?, weekly_study_hours),
             monthly_study_hours = COALESCE(?, monthly_study_hours),
             achievements = COALESCE(?, achievements),
             class_rank = COALESCE(?, class_rank),
             total_students_in_class = COALESCE(?, total_students_in_class),
             updated_at = CURRENT_TIMESTAMP
         WHERE student_id = ?`,
        [study_streak, weekly_study_hours, monthly_study_hours, achievementsJson, class_rank, total_students_in_class, student_id],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update performance data' });
          }
          res.json({ message: 'Performance data updated successfully' });
        }
      );
    } else {
      // Insert new record
      db.run(
        `INSERT INTO academic_performance (student_id, study_streak, weekly_study_hours, monthly_study_hours, achievements, class_rank, total_students_in_class)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [student_id, study_streak || 0, weekly_study_hours || 0, monthly_study_hours || 0, achievementsJson, class_rank, total_students_in_class],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create performance data' });
          }
          res.json({ id: this.lastID, message: 'Performance data created successfully' });
        }
      );
    }
  });
});

// Update academic performance data
app.put('/api/performance/:studentId', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { studentId } = req.params;
  const { study_streak, weekly_study_hours, monthly_study_hours, achievements, class_rank, total_students_in_class } = req.body;
  
  // Validate numeric fields
  if (study_streak !== undefined && (isNaN(study_streak) || study_streak < 0)) {
    return res.status(400).json({ error: 'Study streak must be a non-negative number' });
  }
  
  if (weekly_study_hours !== undefined && (isNaN(weekly_study_hours) || weekly_study_hours < 0)) {
    return res.status(400).json({ error: 'Weekly study hours must be a non-negative number' });
  }
  
  if (monthly_study_hours !== undefined && (isNaN(monthly_study_hours) || monthly_study_hours < 0)) {
    return res.status(400).json({ error: 'Monthly study hours must be a non-negative number' });
  }
  
  if (class_rank !== undefined && (isNaN(class_rank) || class_rank < 1)) {
    return res.status(400).json({ error: 'Class rank must be a positive number' });
  }
  
  if (total_students_in_class !== undefined && (isNaN(total_students_in_class) || total_students_in_class < 1)) {
    return res.status(400).json({ error: 'Total students in class must be a positive number' });
  }
  
  // Convert achievements to JSON string
  let achievementsJson = achievements;
  if (achievements && typeof achievements !== 'string') {
    try {
      achievementsJson = JSON.stringify(achievements);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid achievements format' });
    }
  }
  
  db.run(
    `UPDATE academic_performance 
     SET study_streak = COALESCE(?, study_streak),
         weekly_study_hours = COALESCE(?, weekly_study_hours),
         monthly_study_hours = COALESCE(?, monthly_study_hours),
         achievements = COALESCE(?, achievements),
         class_rank = COALESCE(?, class_rank),
         total_students_in_class = COALESCE(?, total_students_in_class),
         updated_at = CURRENT_TIMESTAMP
     WHERE student_id = ?`,
    [study_streak, weekly_study_hours, monthly_study_hours, achievementsJson, class_rank, total_students_in_class, studentId],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update performance data' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Performance record not found' });
      }
      res.json({ message: 'Performance data updated successfully' });
    }
  );
});

// Delete academic performance data
app.delete('/api/performance/:studentId', authenticateToken, requireTeacherOrManagement, (req, res) => {
  const { studentId } = req.params;
  
  db.run('DELETE FROM academic_performance WHERE student_id = ?', [studentId], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete performance data' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.json({ message: 'Performance data deleted successfully' });
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role],
      async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role, name: user.name },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            phone: user.phone
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/mobile-login', async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      return res.status(400).json({ error: 'Phone and role are required' });
    }

    db.get(
      'SELECT * FROM users WHERE phone = ? AND role = ?',
      [phone, role],
      (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid phone number or role' });
        }

        // In a real app, you would send an actual OTP
        // For demo purposes, we'll accept any 6-digit OTP
        res.json({ 
          success: true, 
          message: 'OTP sent successfully',
          demoOtp: '123456' // For demo purposes
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp, role } = req.body;

    if (!phone || !otp || !role) {
      return res.status(400).json({ error: 'Phone, OTP, and role are required' });
    }

    // For demo purposes, accept '123456' as valid OTP
    if (otp !== '123456') {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    db.get(
      'SELECT * FROM users WHERE phone = ? AND role = ?',
      [phone, role],
      (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid phone number or role' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role, name: user.name },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            phone: user.phone
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Management routes
// Dashboard Stats
app.get('/api/management/stats', authenticateToken, requireManagement, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_students FROM students WHERE status = "active"',
    'SELECT COUNT(*) as total_teachers FROM teachers WHERE status = "active"',
    'SELECT COUNT(*) as total_parents FROM users WHERE role = "parent"',
    'SELECT COALESCE(SUM(amount), 0) as fees_collected FROM fees WHERE status = "paid"',
    'SELECT COALESCE(SUM(amount), 0) as fees_pending FROM fees WHERE status = "pending"',
    'SELECT COUNT(*) as active_classes FROM (SELECT DISTINCT grade FROM students WHERE status = "active")',
    'SELECT COUNT(*) as total_staff FROM teachers',
    'SELECT COUNT(*) as library_books FROM library',
    'SELECT COUNT(*) as transport_routes FROM transport WHERE status = "active"'
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.get(query, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }))
  .then(results => {
    // Calculate attendance rate
    db.get(
      `SELECT 
        COUNT(*) as total_attendance,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count
       FROM attendance a
       WHERE a.date >= date('now', '-30 days')`,
      (err, attendanceResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        const attendance_rate = attendanceResult.total_attendance > 0 
          ? Math.round((attendanceResult.present_count / attendanceResult.total_attendance) * 100)
          : 0;

        res.json({
          total_students: results[0].total_students,
          total_teachers: results[1].total_teachers,
          total_parents: results[2].total_parents,
          fees_collected: results[3].fees_collected,
          fees_pending: results[4].fees_pending,
          attendance_rate: attendance_rate,
          active_classes: results[5].active_classes,
          total_staff: results[6].total_staff,
          monthly_revenue: results[3].fees_collected,
          pending_admissions: 0, // Can be implemented later
          library_books: results[7].library_books,
          transport_routes: results[8].transport_routes
        });
      }
    );
  })
  .catch(error => {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Database error' });
  });
});

// Students Management
app.get('/api/management/students', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT s.*, 
           CASE WHEN s.status = 'active' THEN 'active'
                WHEN s.status = 'inactive' THEN 'inactive'
                ELSE 'graduated' END as status
    FROM students s
    ORDER BY s.name ASC
  `, (err, students) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(students);
  });
});

app.post('/api/management/students', authenticateToken, requireManagement, (req, res) => {
  const { name, grade, email, parent_contact } = req.body;

  if (!name || !grade || !email || !parent_contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO students (name, grade, email, parent_contact) VALUES (?, ?, ?, ?)',
    [name, grade, email, parent_contact],
    function(err) {
      if (err) {
        console.error(err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to add student' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Student added successfully' 
      });
    }
  );
});

app.put('/api/management/students/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { name, grade, email, parent_contact, status } = req.body;

  db.run(
    'UPDATE students SET name = ?, grade = ?, email = ?, parent_contact = ?, status = ? WHERE id = ?',
    [name, grade, email, parent_contact, status || 'active', id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update student' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ message: 'Student updated successfully' });
    }
  );
});

app.delete('/api/management/students/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete student' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Teachers Management
app.get('/api/management/teachers', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT t.*, 
           CASE WHEN t.subjects THEN t.subjects ELSE '' END as subjects_str,
           CASE WHEN t.classes THEN t.classes ELSE '' END as classes_str
    FROM teachers t
    ORDER BY t.name ASC
  `, (err, teachers) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse subjects and classes from strings to arrays
    const processedTeachers = teachers.map(teacher => ({
      ...teacher,
      subjects: teacher.subjects_str ? teacher.subjects_str.split(',') : [],
      classes: teacher.classes_str ? teacher.classes_str.split(',') : []
    }));
    
    res.json(processedTeachers);
  });
});

app.post('/api/management/teachers', authenticateToken, requireManagement, (req, res) => {
  const { name, email, phone, subjects, classes, experience } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const subjectsStr = Array.isArray(subjects) ? subjects.join(',') : '';
  const classesStr = Array.isArray(classes) ? classes.join(',') : '';

  db.run(
    'INSERT INTO teachers (name, email, phone, subjects, classes, experience) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone || '', subjectsStr, classesStr, experience || 0],
    function(err) {
      if (err) {
        console.error(err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to add teacher' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Teacher added successfully' 
      });
    }
  );
});

app.put('/api/management/teachers/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subjects, classes, experience, status } = req.body;

  const subjectsStr = Array.isArray(subjects) ? subjects.join(',') : subjects || '';
  const classesStr = Array.isArray(classes) ? classes.join(',') : classes || '';

  db.run(
    'UPDATE teachers SET name = ?, email = ?, phone = ?, subjects = ?, classes = ?, experience = ?, status = ? WHERE id = ?',
    [name, email, phone, subjectsStr, classesStr, experience, status || 'active', id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update teacher' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      res.json({ message: 'Teacher updated successfully' });
    }
  );
});

app.delete('/api/management/teachers/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM teachers WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete teacher' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  });
});

// Fees Management
app.get('/api/management/fees', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT f.*, s.name as student_name, s.grade 
    FROM fees f 
    JOIN students s ON f.student_id = s.id 
    ORDER BY f.due_date DESC
  `, (err, fees) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(fees);
  });
});

app.post('/api/management/fees', authenticateToken, requireManagement, (req, res) => {
  const { student_id, amount, fee_type, due_date } = req.body;

  if (!student_id || !amount || !fee_type || !due_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if due date is in the past to set overdue status
  const currentDate = new Date().toISOString().split('T')[0];
  const status = due_date < currentDate ? 'overdue' : 'pending';

  db.run(
    'INSERT INTO fees (student_id, amount, fee_type, due_date, status) VALUES (?, ?, ?, ?, ?)',
    [student_id, amount, fee_type, due_date, status],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create fee record' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Fee record created successfully' 
      });
    }
  );
});

app.put('/api/management/fees/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { student_id, amount, fee_type, due_date, status } = req.body;

  db.run(
    'UPDATE fees SET student_id = ?, amount = ?, fee_type = ?, due_date = ?, status = ? WHERE id = ?',
    [student_id, amount, fee_type, due_date, status, id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update fee record' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Fee record not found' });
      }
      res.json({ message: 'Fee record updated successfully' });
    }
  );
});

app.delete('/api/management/fees/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM fees WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete fee record' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Fee record not found' });
    }
    res.json({ message: 'Fee record deleted successfully' });
  });
});

app.post('/api/management/fees/payment', authenticateToken, requireManagement, (req, res) => {
  const { fee_id, payment_method, paid_date } = req.body;

  db.get('SELECT * FROM fees WHERE id = ?', [fee_id], (err, fee) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!fee) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({ error: 'Fee is already paid' });
    }

    db.run(
      'UPDATE fees SET status = ?, paid_date = ?, payment_method = ? WHERE id = ?',
      ['paid', paid_date, payment_method, fee_id],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to record payment' });
        }
        res.json({ message: 'Payment recorded successfully' });
      }
    );
  });
});

// Attendance Management
app.get('/api/management/attendance', authenticateToken, requireManagement, (req, res) => {
  const { date, grade } = req.query;
  
  let query = `
    SELECT a.*, s.name as student_name, s.grade 
    FROM attendance a 
    JOIN students s ON a.student_id = s.id 
    WHERE 1=1
  `;
  const params = [];
  
  if (date) {
    query += ' AND a.date = ?';
    params.push(date);
  }
  
  if (grade) {
    query += ' AND s.grade = ?';
    params.push(grade);
  }
  
  query += ' ORDER BY a.date DESC, s.name ASC';

  db.all(query, params, (err, attendance) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(attendance);
  });
});

app.post('/api/management/attendance/bulk', authenticateToken, requireManagement, (req, res) => {
  const { attendanceRecords } = req.body;

  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res.status(400).json({ error: 'Attendance records array is required' });
  }

  const insertPromises = attendanceRecords.map(record => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
        [record.student_id, record.date, record.status],
        function(err) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  });

  Promise.all(insertPromises)
    .then(() => {
      res.json({ message: 'Bulk attendance updated successfully' });
    })
    .catch(error => {
      console.error('Bulk attendance error:', error);
      res.status(500).json({ error: 'Failed to update attendance records' });
    });
});

// Announcements Management
app.get('/api/management/announcements', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT * FROM announcements 
    ORDER BY date DESC, created_at DESC
  `, (err, announcements) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse target_audience from string to array
    const processedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      target_audience: announcement.target_audience ? announcement.target_audience.split(',') : []
    }));
    
    res.json(processedAnnouncements);
  });
});

app.post('/api/management/announcements', authenticateToken, requireManagement, (req, res) => {
  const { title, content, priority, category, target_audience } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required' });
  }

  const targetAudienceStr = Array.isArray(target_audience) ? target_audience.join(',') : '';
  const author = req.user.name || 'Administrator';

  db.run(
    'INSERT INTO announcements (title, content, priority, category, author, target_audience) VALUES (?, ?, ?, ?, ?, ?)',
    [title, content, priority || 'medium', category, author, targetAudienceStr],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create announcement' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Announcement created successfully' 
      });
    }
  );
});

app.put('/api/management/announcements/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { title, content, priority, category, target_audience } = req.body;

  const targetAudienceStr = Array.isArray(target_audience) ? target_audience.join(',') : target_audience || '';

  db.run(
    'UPDATE announcements SET title = ?, content = ?, priority = ?, category = ?, target_audience = ? WHERE id = ?',
    [title, content, priority, category, targetAudienceStr, id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update announcement' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      res.json({ message: 'Announcement updated successfully' });
    }
  );
});

app.delete('/api/management/announcements/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM announcements WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete announcement' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  });
});

app.patch('/api/management/announcements/:id/publish', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.get('SELECT is_published FROM announcements WHERE id = ?', [id], (err, announcement) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const newStatus = announcement.is_published ? 0 : 1;
    
    db.run(
      'UPDATE announcements SET is_published = ? WHERE id = ?',
      [newStatus, id],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update announcement' });
        }
        res.json({ 
          message: `Announcement ${newStatus ? 'published' : 'unpublished'} successfully` 
        });
      }
    );
  });
});

// Performance/Grades Management
app.get('/api/management/performance', authenticateToken, requireManagement, (req, res) => {
  const { grade, subject } = req.query;
  
  let query = `
    SELECT g.*, s.name as student_name, s.grade as student_grade 
    FROM grades g 
    JOIN students s ON g.student_id = s.id 
    WHERE 1=1
  `;
  const params = [];
  
  if (grade) {
    query += ' AND s.grade = ?';
    params.push(grade);
  }
  
  if (subject) {
    query += ' AND g.subject = ?';
    params.push(subject);
  }
  
  query += ' ORDER BY g.date DESC';

  db.all(query, params, (err, performance) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(performance);
  });
});

// Library Management
app.get('/api/management/library', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT * FROM library 
    ORDER BY 
      CASE status 
        WHEN 'overdue' THEN 1 
        WHEN 'issued' THEN 2 
        WHEN 'returned' THEN 3 
        ELSE 4 
      END,
      issue_date DESC
  `, (err, library) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(library);
  });
});

app.post('/api/management/library', authenticateToken, requireManagement, (req, res) => {
  const { book_title, book_isbn, student_id, student_name, issue_date } = req.body;

  if (!book_title || !student_name) {
    return res.status(400).json({ error: 'Book title and student name are required' });
  }

  db.run(
    'INSERT INTO library (book_title, book_isbn, student_id, student_name, issue_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    [book_title, book_isbn, student_id, student_name, issue_date || new Date().toISOString().split('T')[0], 'issued'],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create library record' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Library record created successfully' 
      });
    }
  );
});

app.put('/api/management/library/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { book_title, book_isbn, student_name, issue_date, return_date, status } = req.body;

  db.run(
    'UPDATE library SET book_title = ?, book_isbn = ?, student_name = ?, issue_date = ?, return_date = ?, status = ? WHERE id = ?',
    [book_title, book_isbn, student_name, issue_date, return_date, status, id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update library record' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Library record not found' });
      }
      res.json({ message: 'Library record updated successfully' });
    }
  );
});

app.patch('/api/management/library/:id/return', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const returnDate = new Date().toISOString().split('T')[0];

  db.run(
    'UPDATE library SET return_date = ?, status = ? WHERE id = ?',
    [returnDate, 'returned', id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to return book' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Library record not found' });
      }
      res.json({ message: 'Book returned successfully' });
    }
  );
});

// Transport Management
app.get('/api/management/transport', authenticateToken, requireManagement, (req, res) => {
  db.all(`
    SELECT * FROM transport 
    ORDER BY status DESC, route_name ASC
  `, (err, transport) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(transport);
  });
});

app.post('/api/management/transport', authenticateToken, requireManagement, (req, res) => {
  const { route_name, driver_name, bus_number, students_count } = req.body;

  if (!route_name || !driver_name || !bus_number) {
    return res.status(400).json({ error: 'Route name, driver name, and bus number are required' });
  }

  db.run(
    'INSERT INTO transport (route_name, driver_name, bus_number, students_count) VALUES (?, ?, ?, ?)',
    [route_name, driver_name, bus_number, students_count || 0],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create transport route' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Transport route created successfully' 
      });
    }
  );
});

app.put('/api/management/transport/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;
  const { route_name, driver_name, bus_number, students_count, status } = req.body;

  db.run(
    'UPDATE transport SET route_name = ?, driver_name = ?, bus_number = ?, students_count = ?, status = ? WHERE id = ?',
    [route_name, driver_name, bus_number, students_count, status || 'active', id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update transport route' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transport route not found' });
      }
      res.json({ message: 'Transport route updated successfully' });
    }
  );
});

app.delete('/api/management/transport/:id', authenticateToken, requireManagement, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM transport WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete transport route' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transport route not found' });
    }
    res.json({ message: 'Transport route deleted successfully' });
  });
});

// Existing routes (schedule, fees, students, attendance, grades, feedback, dashboard stats)
// ... (keep all existing routes as they are)

// Schedule routes
app.get('/api/schedule', authenticateToken, (req, res) => {
  console.log('GET /api/schedule - User role:', req.user.role, 'User ID:', req.user.id);
  
  // Check if table exists and has correct structure
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='schedule_events'", (err, table) => {
    if (err) {
      console.error('Error checking table:', err);
      return res.status(500).json({ error: 'Database error checking table' });
    }
    
    if (!table) {
      console.error('schedule_events table does not exist');
      return res.status(500).json({ error: 'Schedule table not found. Please restart the server.' });
    }
    
    // Check table structure
    db.all("PRAGMA table_info(schedule_events)", (err, columns) => {
      if (err) {
        console.error('Error checking table structure:', err);
        return res.status(500).json({ error: 'Database error checking table structure' });
      }
      
      console.log('Table structure:', columns.map(col => col.name));
      
      // Proceed with the actual query
      executeScheduleQuery();
    });
  });
  
  function executeScheduleQuery() {
    if (req.user.role === 'parent') {
      // For parents, show schedules for their children (both general and specific)
      console.log('Fetching schedule for parent ID:', req.user.id);
      db.all(
        `SELECT s.*, st.name as student_name, st.grade as student_grade
         FROM schedule_events s 
         LEFT JOIN students st ON s.student_id = st.id 
         WHERE s.student_id IS NULL OR st.parent_id = ?
         ORDER BY 
           CASE s.day 
             WHEN 'Monday' THEN 1 
             WHEN 'Tuesday' THEN 2 
             WHEN 'Wednesday' THEN 3 
             WHEN 'Thursday' THEN 4 
             WHEN 'Friday' THEN 5 
             WHEN 'Saturday' THEN 6 
             ELSE 7 
           END, 
           s.start_time ASC`,
        [req.user.id],
        (err, events) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          console.log('Parent schedule events found:', events.length);
          res.json(events);
        }
      );
    } else {
      // For teachers and management, show all schedules
      console.log('Fetching all schedules for teacher/management');
      db.all(
        `SELECT s.*, st.name as student_name, st.grade as student_grade
         FROM schedule_events s 
         LEFT JOIN students st ON s.student_id = st.id 
         ORDER BY 
           CASE s.day 
             WHEN 'Monday' THEN 1 
             WHEN 'Tuesday' THEN 2 
             WHEN 'Wednesday' THEN 3 
             WHEN 'Thursday' THEN 4 
             WHEN 'Friday' THEN 5 
             WHEN 'Saturday' THEN 6 
             ELSE 7 
           END, 
           s.start_time ASC`,
        (err, events) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          console.log('Teacher/Management schedule events found:', events.length);
          res.json(events);
        }
      );
    }
  }
});

app.post('/api/schedule', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Access denied. Only teachers and management can add schedule events.' });
  }

  console.log('POST /api/schedule - User:', req.user.role, 'Request body:', req.body);
  
  const { subject, day, start_time, end_time, location, student_id, notes } = req.body;

  // Validate required fields
  if (!subject || !day || !start_time || !end_time || !location) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ error: 'All required fields must be filled: subject, day, start time, end time, and location' });
  }

  // Trim whitespace from string fields
  const trimmedSubject = subject.trim();
  const trimmedDay = day.trim();
  const trimmedStartTime = start_time.trim();
  const trimmedEndTime = end_time.trim();
  const trimmedLocation = location.trim();
  const trimmedNotes = notes ? notes.trim() : '';

  // Additional validation
  if (!trimmedSubject || !trimmedDay || !trimmedStartTime || !trimmedEndTime || !trimmedLocation) {
    console.log('Validation failed: Empty fields after trimming');
    return res.status(400).json({ error: 'All required fields must contain valid data (not just spaces)' });
  }

  // Validate day
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!validDays.includes(trimmedDay)) {
    console.log('Validation failed: Invalid day:', trimmedDay);
    return res.status(400).json({ error: `Invalid day "${trimmedDay}". Must be one of: ${validDays.join(', ')}` });
  }

  // Validate time format (HH:MM) - more flexible regex
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(trimmedStartTime)) {
    console.log('Validation failed: Invalid start time format:', trimmedStartTime);
    return res.status(400).json({ error: `Invalid start time format "${trimmedStartTime}". Use HH:MM format (e.g., 09:00)` });
  }
  
  if (!timeRegex.test(trimmedEndTime)) {
    console.log('Validation failed: Invalid end time format:', trimmedEndTime);
    return res.status(400).json({ error: `Invalid end time format "${trimmedEndTime}". Use HH:MM format (e.g., 10:00)` });
  }

  // Validate that end time is after start time
  const startMinutes = parseInt(trimmedStartTime.split(':')[0]) * 60 + parseInt(trimmedStartTime.split(':')[1]);
  const endMinutes = parseInt(trimmedEndTime.split(':')[0]) * 60 + parseInt(trimmedEndTime.split(':')[1]);
  
  if (endMinutes <= startMinutes) {
    console.log('Validation failed: End time not after start time');
    return res.status(400).json({ error: `End time (${trimmedEndTime}) must be after start time (${trimmedStartTime})` });
  }

  // Validate student_id if provided
  let finalStudentId = null;
  if (student_id && student_id !== '' && student_id !== 'null' && student_id !== 'undefined') {
    finalStudentId = parseInt(student_id);
    if (isNaN(finalStudentId)) {
      console.log('Validation failed: Invalid student_id:', student_id);
      return res.status(400).json({ error: 'Invalid student ID provided' });
    }
  }
  
  console.log('Processed data:', {
    subject: trimmedSubject,
    day: trimmedDay,
    start_time: trimmedStartTime,
    end_time: trimmedEndTime,
    location: trimmedLocation,
    student_id: finalStudentId,
    notes: trimmedNotes
  });

  db.run(
    `INSERT INTO schedule_events (subject, day, start_time, end_time, location, student_id, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [trimmedSubject, trimmedDay, trimmedStartTime, trimmedEndTime, trimmedLocation, finalStudentId, trimmedNotes],
    function(err) {
      if (err) {
        console.error('Database insert error:', err);
        if (err.message.includes('FOREIGN KEY constraint failed')) {
          return res.status(400).json({ error: 'Invalid student selected' });
        }
        return res.status(500).json({ error: 'Database error: Failed to add schedule event' });
      }
      
      console.log('Schedule event created with ID:', this.lastID);
      
      res.json({ 
        id: this.lastID, 
        message: 'Schedule event added successfully',
        schedule: {
          id: this.lastID,
          subject: trimmedSubject,
          day: trimmedDay,
          start_time: trimmedStartTime,
          end_time: trimmedEndTime,
          location: trimmedLocation,
          student_id: finalStudentId,
          notes: trimmedNotes
        }
      });
    }
  );
});

app.put('/api/schedule/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Access denied. Only teachers and management can update schedule events.' });
  }

  console.log('PUT /api/schedule/:id - ID:', req.params.id, 'Request body:', req.body);
  
  const { id } = req.params;
  const { subject, day, start_time, end_time, location, student_id, notes } = req.body;

  // Validate required fields
  if (!subject || !day || !start_time || !end_time || !location) {
    return res.status(400).json({ error: 'All required fields must be filled: subject, day, start time, end time, and location' });
  }

  // Trim whitespace from string fields
  const trimmedSubject = subject.trim();
  const trimmedDay = day.trim();
  const trimmedStartTime = start_time.trim();
  const trimmedEndTime = end_time.trim();
  const trimmedLocation = location.trim();
  const trimmedNotes = notes ? notes.trim() : '';

  // Validate day
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!validDays.includes(trimmedDay)) {
    return res.status(400).json({ error: `Invalid day "${trimmedDay}". Must be one of: ${validDays.join(', ')}` });
  }

  // Validate time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(trimmedStartTime)) {
    return res.status(400).json({ error: `Invalid start time format "${trimmedStartTime}". Use HH:MM format` });
  }
  if (!timeRegex.test(trimmedEndTime)) {
    return res.status(400).json({ error: `Invalid end time format "${trimmedEndTime}". Use HH:MM format` });
  }

  // Validate that end time is after start time
  const startMinutes = parseInt(trimmedStartTime.split(':')[0]) * 60 + parseInt(trimmedStartTime.split(':')[1]);
  const endMinutes = parseInt(trimmedEndTime.split(':')[0]) * 60 + parseInt(trimmedEndTime.split(':')[1]);
  
  if (endMinutes <= startMinutes) {
    return res.status(400).json({ error: `End time (${trimmedEndTime}) must be after start time (${trimmedStartTime})` });
  }

  let finalStudentId = null;
  if (student_id && student_id !== '' && student_id !== 'null' && student_id !== 'undefined') {
    finalStudentId = parseInt(student_id);
    if (isNaN(finalStudentId)) {
      return res.status(400).json({ error: 'Invalid student ID provided' });
    }
  }

  db.run(
    `UPDATE schedule_events 
     SET subject = ?, day = ?, start_time = ?, end_time = ?, location = ?, student_id = ?, notes = ? 
     WHERE id = ?`,
    [trimmedSubject, trimmedDay, trimmedStartTime, trimmedEndTime, trimmedLocation, finalStudentId, trimmedNotes, id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error: Failed to update schedule event' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Schedule event not found' });
      }

      console.log('Schedule event updated, ID:', id);
      res.json({ message: 'Schedule event updated successfully' });
    }
  );
});

app.delete('/api/schedule/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Access denied. Only teachers and management can delete schedule events.' });
  }

  console.log('DELETE /api/schedule/:id - ID:', req.params.id);
  
  const { id } = req.params;

  db.run('DELETE FROM schedule_events WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error: Failed to delete schedule event' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Schedule event not found' });
    }

    console.log('Schedule event deleted, ID:', id);
    res.json({ message: 'Schedule event deleted successfully' });
  });
});

// Fees routes
app.get('/api/fees', authenticateToken, (req, res) => {
  if (req.user.role === 'parent') {
    db.all(
      `SELECT f.*, s.name as student_name, s.grade 
       FROM fees f 
       JOIN students s ON f.student_id = s.id 
       WHERE s.parent_id = ?
       ORDER BY f.due_date DESC`,
      [req.user.id],
      (err, fees) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(fees);
      }
    );
  } else {
    db.all(
      `SELECT f.*, s.name as student_name, s.grade 
       FROM fees f 
       JOIN students s ON f.student_id = s.id 
       ORDER BY f.due_date DESC`,
      (err, fees) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(fees);
      }
    );
  }
});

app.post('/api/fees', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can create fee records' });
  }

  const { student_id, amount, fee_type, due_date } = req.body;

  if (!student_id || !amount || !fee_type || !due_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if due date is in the past to set overdue status
  const currentDate = new Date().toISOString().split('T')[0];
  const status = due_date < currentDate ? 'overdue' : 'pending';

  db.run(
    'INSERT INTO fees (student_id, amount, fee_type, due_date, status) VALUES (?, ?, ?, ?, ?)',
    [student_id, amount, fee_type, due_date, status],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create fee record' });
      }
      res.json({ 
        id: this.lastID, 
        message: 'Fee record created successfully',
        fee: {
          id: this.lastID,
          student_id,
          amount,
          fee_type,
          due_date,
          status
        }
      });
    }
  );
});

app.post('/api/fees/payment', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can add fee payments' });
  }

  const { fee_id, payment_method, paid_date } = req.body;

  db.get('SELECT * FROM fees WHERE id = ?', [fee_id], (err, fee) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!fee) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({ error: 'Fee is already paid' });
    }

    db.run(
      'UPDATE fees SET status = ?, paid_date = ?, payment_method = ? WHERE id = ?',
      ['paid', paid_date, payment_method, fee_id],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to record payment' });
        }

        res.json({ message: 'Payment recorded successfully' });
      }
    );
  });
});

app.delete('/api/fees/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can delete fee records' });
  }

  const { id } = req.params;

  db.run('DELETE FROM fees WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete fee record' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    res.json({ message: 'Fee record deleted successfully' });
  });
});

// Student routes
app.get('/api/students', authenticateToken, (req, res) => {
  if (req.user.role === 'parent') {
    db.all(
      'SELECT * FROM students WHERE parent_id = ?',
      [req.user.id],
      (err, students) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(students);
      }
    );
  } else {
    db.all('SELECT * FROM students', (err, students) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(students);
    });
  }
});

app.post('/api/students', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can add students' });
  }

  const { name, grade, email, parent_contact } = req.body;

  db.run(
    'INSERT INTO students (name, grade, email, parent_contact) VALUES (?, ?, ?, ?)',
    [name, grade, email, parent_contact],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add student' });
      }
      res.json({ id: this.lastID, message: 'Student added successfully' });
    }
  );
});

// Attendance routes
app.get('/api/attendance', authenticateToken, (req, res) => {
  const { date } = req.query;
  
  if (req.user.role === 'parent') {
    db.all(
      `SELECT a.*, s.name as student_name, s.grade 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE s.parent_id = ? ${date ? 'AND a.date = ?' : ''}
       ORDER BY a.date DESC`,
      date ? [req.user.id, date] : [req.user.id],
      (err, attendance) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(attendance);
      }
    );
  } else {
    db.all(
      `SELECT a.*, s.name as student_name, s.grade 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       ${date ? 'WHERE a.date = ?' : ''}
       ORDER BY a.date DESC`,
      date ? [date] : [],
      (err, attendance) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(attendance);
      }
    );
  }
});

app.post('/api/attendance', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can record attendance' });
  }

  const { student_id, date, status } = req.body;

  db.run(
    'INSERT OR REPLACE INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
    [student_id, date, status],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to record attendance' });
      }
      res.json({ message: 'Attendance recorded successfully' });
    }
  );
});

// Grades routes
app.get('/api/grades', authenticateToken, (req, res) => {
  if (req.user.role === 'parent') {
    db.all(
      `SELECT g.*, s.name as student_name, s.grade as student_grade 
       FROM grades g 
       JOIN students s ON g.student_id = s.id 
       WHERE s.parent_id = ?
       ORDER BY g.date DESC`,
      [req.user.id],
      (err, grades) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(grades);
      }
    );
  } else {
    db.all(
      `SELECT g.*, s.name as student_name, s.grade as student_grade 
       FROM grades g 
       JOIN students s ON g.student_id = s.id 
       ORDER BY g.date DESC`,
      (err, grades) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(grades);
      }
    );
  }
});

app.post('/api/grades', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can add grades' });
  }

  const { student_id, subject, score, date } = req.body;
  const grade = getLetterGrade(score);

  db.run(
    'INSERT INTO grades (student_id, subject, score, grade, date) VALUES (?, ?, ?, ?, ?)',
    [student_id, subject, score, grade, date],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add grade' });
      }
      res.json({ id: this.lastID, message: 'Grade added successfully' });
    }
  );
});

// Feedback routes
app.get('/api/feedback', authenticateToken, (req, res) => {
  if (req.user.role === 'parent') {
    db.all(
      `SELECT f.*, s.name as student_name, s.grade as student_grade 
       FROM feedback f 
       JOIN students s ON f.student_id = s.id 
       WHERE s.parent_id = ?
       ORDER BY f.date DESC`,
      [req.user.id],
      (err, feedback) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(feedback);
      }
    );
  } else {
    db.all(
      `SELECT f.*, s.name as student_name, s.grade as student_grade 
       FROM feedback f 
       JOIN students s ON f.student_id = s.id 
       ORDER BY f.date DESC`,
      (err, feedback) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(feedback);
      }
    );
  }
});

app.post('/api/feedback', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'management') {
    return res.status(403).json({ error: 'Only teachers and management can add feedback' });
  }

  const { student_id, subject, message, rating, date } = req.body;

  db.run(
    'INSERT INTO feedback (student_id, subject, message, rating, date) VALUES (?, ?, ?, ?, ?)',
    [student_id, subject, message, rating, date],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add feedback' });
      }
      res.json({ id: this.lastID, message: 'Feedback added successfully' });
    }
  );
});

// Dashboard stats routes - FIXED PARENT BRANCH
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  if (req.user.role === 'teacher') {
    // Teacher dashboard stats
    db.get('SELECT COUNT(*) as total_students FROM students', (err, studentCount) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      const today = new Date().toISOString().split('T')[0];
      db.get(
        `SELECT 
          COUNT(*) as total_attendance,
          SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count
         FROM attendance a WHERE a.date = ?`,
        [today],
        (err, attendanceStats) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
          }

          db.get('SELECT AVG(score) as avg_score FROM grades', (err, gradeStats) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database error' });
            }

            db.get('SELECT COUNT(*) as total_feedback FROM feedback', (err, feedbackCount) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
              }

              const attendanceRate = attendanceStats.total_attendance > 0 
                ? Math.round((attendanceStats.present_count / attendanceStats.total_attendance) * 100)
                : 0;

              res.json({
                total_students: studentCount.total_students,
                attendance_rate: attendanceRate,
                class_average: Math.round(gradeStats.avg_score || 0),
                total_feedback: feedbackCount.total_feedback
              });
            });
          });
        }
      );
    });
  } else {
    // Parent dashboard stats - FIXED VERSION
    db.get(
      `SELECT 
        COUNT(*) as total_attendance,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE s.parent_id = ?`,
      [req.user.id],
      (err, attendanceStats) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }

        db.get(
          `SELECT AVG(score) as avg_score 
           FROM grades g 
           JOIN students s ON g.student_id = s.id 
           WHERE s.parent_id = ?`,
          [req.user.id],
          (err, gradeStats) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database error' });
            }

            db.get(
              `SELECT COUNT(*) as total_feedback 
               FROM feedback f 
               JOIN students s ON f.student_id = s.id 
               WHERE s.parent_id = ?`,
              [req.user.id],
              (err, feedbackCount) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Database error' });
                }

                const attendanceRate = attendanceStats?.total_attendance > 0 
                  ? Math.round((attendanceStats.present_count / attendanceStats.total_attendance) * 100)
                  : 0;

                res.json({
                  attendance_rate: attendanceRate,
                  grade_average: Math.round(gradeStats.avg_score || 0),
                  total_feedback: feedbackCount.total_feedback
                });
              }
            );
          }
        );
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
