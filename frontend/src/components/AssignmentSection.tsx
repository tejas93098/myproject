import React, { useState, useEffect } from 'react';
import { assignmentsAPI, studentAPI } from '../utils/api';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Send,
  Award,
  Download,
  Upload,
  Eye,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  BookMarked,
  Clipboard,
  PenTool,
  FlaskConical,
  HelpCircle,
  Filter,
  Search,
  X,
  Save,
  RotateCcw
} from 'lucide-react';

interface Assignment {
  id: number;
  teacher_id: number;
  teacher_name: string;
  title: string;
  description: string;
  subject: string;
  class_grade: string | null;
  student_id: number | null;
  due_date: string;
  total_marks: number;
  assignment_type: 'homework' | 'project' | 'test' | 'quiz' | 'lab';
  status: 'assigned' | 'submitted' | 'graded' | 'overdue';
  assigned_date: string;
  target_name?: string;
  submission_count?: number;
  graded_count?: number;
  submission_status?: string;
  grade_received?: number;
  submission_date?: string;
  submission_feedback?: string;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  email: string;
}

interface AssignmentSectionProps {
  userRole: 'teacher' | 'parent';
  userId: number;
}

const AssignmentSection: React.FC<AssignmentSectionProps> = ({ userRole, userId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [expandedAssignments, setExpandedAssignments] = useState<Set<number>>(new Set());
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form states
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subject: '',
    class_grade: '',
    student_id: '',
    due_date: '',
    total_marks: 100,
    assignment_type: 'homework' as 'homework' | 'project' | 'test' | 'quiz' | 'lab',
    assign_to: 'class' as 'class' | 'student' // New field to track assignment type
  });

  const [submissionForm, setSubmissionForm] = useState({
    student_id: '',
    submission_text: ''
  });

  const [gradeForm, setGradeForm] = useState({
    student_id: '',
    grade_received: '',
    feedback: ''
  });

  // Available subjects
  const subjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Art', 'Physical Education'
  ];

  // Assignment type configurations
  const assignmentTypeConfig = {
    homework: { icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Homework' },
    project: { icon: Target, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Project' },
    test: { icon: FileText, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Test' },
    quiz: { icon: HelpCircle, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Quiz' },
    lab: { icon: FlaskConical, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Lab Work' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsResponse, studentsResponse] = await Promise.all([
        assignmentsAPI.getAll(),
        userRole === 'teacher' ? studentAPI.getAll() : Promise.resolve({ data: [] })
      ]);
      
      setAssignments(assignmentsResponse.data);
      setStudents(studentsResponse.data);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error(error.response?.data?.error || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || assignment.subject === filterSubject;
    const matchesType = filterType === '' || assignment.assignment_type === filterType;
    const matchesStatus = filterStatus === '' || 
                         (filterStatus === 'submitted' && assignment.submission_status === 'submitted') ||
                         (filterStatus === 'graded' && assignment.submission_status === 'graded') ||
                         (filterStatus === 'pending' && (!assignment.submission_status || assignment.submission_status === 'not_submitted')) ||
                         (filterStatus === 'overdue' && new Date(assignment.due_date) < new Date());
    
    return matchesSearch && matchesSubject && matchesType && matchesStatus;
  });

  // Form validation function
  const validateAssignmentForm = () => {
    const errors: string[] = [];

    if (!assignmentForm.title.trim()) {
      errors.push('Title is required');
    }

    if (!assignmentForm.description.trim()) {
      errors.push('Description is required');
    }

    if (!assignmentForm.subject.trim()) {
      errors.push('Subject is required');
    }

    if (!assignmentForm.due_date) {
      errors.push('Due date is required');
    }

    // Validate assignment target
    if (assignmentForm.assign_to === 'class') {
      if (!assignmentForm.class_grade) {
        errors.push('Please select a class');
      }
    } else if (assignmentForm.assign_to === 'student') {
      if (!assignmentForm.student_id) {
        errors.push('Please select a student');
      }
    }

    // Validate due date is not in the past
    if (assignmentForm.due_date) {
      const dueDate = new Date(assignmentForm.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        errors.push('Due date cannot be in the past');
      }
    }

    // Validate total marks
    if (assignmentForm.total_marks < 1 || assignmentForm.total_marks > 1000) {
      errors.push('Total marks must be between 1 and 1000');
    }

    return errors;
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateAssignmentForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '));
      return;
    }

    try {
      // Prepare assignment data based on assignment target
      const assignmentData = {
        title: assignmentForm.title.trim(),
        description: assignmentForm.description.trim(),
        subject: assignmentForm.subject.trim(),
        due_date: assignmentForm.due_date,
        total_marks: assignmentForm.total_marks,
        assignment_type: assignmentForm.assignment_type
      };

      // Add either class_grade or student_id based on assignment target
      if (assignmentForm.assign_to === 'class') {
        (assignmentData as any).class_grade = assignmentForm.class_grade;
        // Make sure student_id is not included
      } else if (assignmentForm.assign_to === 'student') {
        (assignmentData as any).student_id = parseInt(assignmentForm.student_id);
        // Make sure class_grade is not included
      }

      console.log('Creating assignment with data:', assignmentData);

      const response = await assignmentsAPI.create(assignmentData);
      
      if (response.data.success) {
        toast.success('Assignment created successfully');
        setShowCreateForm(false);
        
        // Reset form
        setAssignmentForm({
          title: '',
          description: '',
          subject: '',
          class_grade: '',
          student_id: '',
          due_date: '',
          total_marks: 100,
          assignment_type: 'homework',
          assign_to: 'class'
        });
        
        // Refresh assignments list
        fetchData();
      } else {
        throw new Error(response.data.message || 'Failed to create assignment');
      }
    } catch (error: any) {
      console.error('Failed to create assignment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to create assignment';
      toast.error(errorMessage);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    // Validate form
    if (!submissionForm.student_id || !submissionForm.submission_text.trim()) {
      toast.error('Please select a student and enter submission text');
      return;
    }

    try {
      await assignmentsAPI.submit(selectedAssignment.id, {
        student_id: parseInt(submissionForm.student_id),
        submission_text: submissionForm.submission_text.trim()
      });
      
      toast.success('Assignment submitted successfully');
      setShowSubmissionModal(false);
      setSubmissionForm({ student_id: '', submission_text: '' });
      fetchData();
    } catch (error: any) {
      console.error('Failed to submit assignment:', error);
      toast.error(error.response?.data?.error || 'Failed to submit assignment');
    }
  };

  const handleGradeAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    // Validate form
    if (!gradeForm.student_id || !gradeForm.grade_received) {
      toast.error('Please select a student and enter a grade');
      return;
    }

    const grade = parseInt(gradeForm.grade_received);
    if (isNaN(grade) || grade < 0 || grade > selectedAssignment.total_marks) {
      toast.error(`Grade must be between 0 and ${selectedAssignment.total_marks}`);
      return;
    }

    try {
      await assignmentsAPI.grade(selectedAssignment.id, {
        student_id: parseInt(gradeForm.student_id),
        grade_received: grade,
        feedback: gradeForm.feedback.trim()
      });
      
      toast.success('Assignment graded successfully');
      setShowGradeModal(false);
      setGradeForm({ student_id: '', grade_received: '', feedback: '' });
      fetchData();
    } catch (error: any) {
      console.error('Failed to grade assignment:', error);
      toast.error(error.response?.data?.error || 'Failed to grade assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    try {
      await assignmentsAPI.delete(assignmentId);
      toast.success('Assignment deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete assignment:', error);
      toast.error(error.response?.data?.error || 'Failed to delete assignment');
    }
  };

  const toggleExpanded = (assignmentId: number) => {
    const newExpanded = new Set(expandedAssignments);
    if (newExpanded.has(assignmentId)) {
      newExpanded.delete(assignmentId);
    } else {
      newExpanded.add(assignmentId);
    }
    setExpandedAssignments(newExpanded);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (assignment: Assignment) => {
    const daysUntilDue = getDaysUntilDue(assignment.due_date);
    const isOverdue = daysUntilDue < 0;
    
    if (userRole === 'parent' && assignment.submission_status) {
      if (assignment.submission_status === 'graded') {
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full border border-green-200">
            <Award className="w-3 h-3 mr-1" />
            Graded ({assignment.grade_received}/{assignment.total_marks})
          </span>
        );
      } else if (assignment.submission_status === 'submitted') {
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full border border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Submitted
          </span>
        );
      }
    }
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full border border-red-200 animate-pulse">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </span>
      );
    } else if (daysUntilDue <= 3) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full border border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full border border-green-200">
          <Calendar className="w-3 h-3 mr-1" />
          Due in {daysUntilDue} days
        </span>
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSubject('');
    setFilterType('');
    setFilterStatus('');
  };

  // Handle assignment target change
  const handleAssignToChange = (assignTo: 'class' | 'student') => {
    setAssignmentForm({
      ...assignmentForm,
      assign_to: assignTo,
      class_grade: assignTo === 'class' ? assignmentForm.class_grade : '',
      student_id: assignTo === 'student' ? assignmentForm.student_id : ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assignments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <BookMarked className="w-8 h-8 mr-3 text-blue-600" />
            {userRole === 'teacher' ? 'Assignment Manager' : 'My Assignments'}
          </h1>
          <p className="text-gray-600 mt-2">
            {userRole === 'teacher' 
              ? 'Create, manage, and grade assignments for your students'
              : 'View and submit assignments from your teachers'
            }
          </p>
        </div>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">All Types</option>
              {Object.entries(assignmentTypeConfig).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="flex items-center justify-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-4">
              {userRole === 'teacher' 
                ? 'Create your first assignment to get started'
                : 'No assignments have been created yet'
              }
            </p>
            {userRole === 'teacher' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Assignment
              </button>
            )}
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const typeConfig = assignmentTypeConfig[assignment.assignment_type];
            const TypeIcon = typeConfig.icon;
            const isExpanded = expandedAssignments.has(assignment.id);
            
            return (
              <div
                key={assignment.id}
                className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 ${typeConfig.bgColor} rounded-lg`}>
                          <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">{assignment.subject} • {typeConfig.label}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {getStatusBadge(assignment)}
                        
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full border border-purple-200">
                          {assignment.class_grade 
                            ? `Class ${assignment.class_grade}` 
                            : assignment.target_name || 'Individual'
                          }
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          By {assignment.teacher_name} • Due {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {userRole === 'teacher' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowGradeModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Grade Assignment"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {userRole === 'parent' && !assignment.submission_status && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmissionModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Submit Assignment"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleExpanded(assignment.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'max-h-none' : 'max-h-16'
                  }`}>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {assignment.description}
                    </p>
                  </div>

                  {/* Submission Info for Parents */}
                  {userRole === 'parent' && assignment.submission_status && assignment.submission_status !== 'not_submitted' && isExpanded && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Clipboard className="w-4 h-4 mr-2" />
                        Your Submission
                      </h4>
                      {assignment.submission_date && (
                        <p className="text-blue-700 text-sm mb-1">
                          Submitted on: {new Date(assignment.submission_date).toLocaleDateString()}
                        </p>
                      )}
                      {assignment.grade_received !== undefined && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-700 text-sm font-medium">Grade:</span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            (assignment.grade_received / assignment.total_marks) >= 0.9 ? 'bg-green-100 text-green-800' :
                            (assignment.grade_received / assignment.total_marks) >= 0.8 ? 'bg-blue-100 text-blue-800' :
                            (assignment.grade_received / assignment.total_marks) >= 0.7 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {assignment.grade_received}/{assignment.total_marks} ({Math.round((assignment.grade_received / assignment.total_marks) * 100)}%)
                          </span>
                        </div>
                      )}
                      {assignment.submission_feedback && (
                        <div className="mt-2">
                          <p className="text-blue-700 text-sm font-medium mb-1">Teacher Feedback:</p>
                          <p className="text-blue-600 text-sm italic bg-white/50 p-2 rounded">
                            "{assignment.submission_feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assignment Details */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <p className="font-medium">Due Date</p>
                          <p>{new Date(assignment.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Target className="w-4 h-4 mr-2 text-green-500" />
                        <div>
                          <p className="font-medium">Total Marks</p>
                          <p>{assignment.total_marks} points</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        <div>
                          <p className="font-medium">Assigned</p>
                          <p>{new Date(assignment.assigned_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Teacher View: Submission Stats */}
                  {userRole === 'teacher' && isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Submissions: {assignment.submission_count || 0}
                          </span>
                          <span className="text-gray-600">
                            Graded: {assignment.graded_count || 0}
                          </span>
                        </div>
                        {assignment.submission_count && assignment.submission_count > 0 && (
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${((assignment.graded_count || 0) / assignment.submission_count) * 100}%`
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Assignment</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assignment title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm({...assignmentForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={assignmentForm.assignment_type}
                      onChange={(e) => setAssignmentForm({...assignmentForm, assignment_type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(assignmentTypeConfig).map(([type, config]) => (
                        <option key={type} value={type}>{config.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assignment Target Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="assignTo"
                          checked={assignmentForm.assign_to === 'class'}
                          onChange={() => handleAssignToChange('class')}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">Entire Class</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="assignTo"
                          checked={assignmentForm.assign_to === 'student'}
                          onChange={() => handleAssignToChange('student')}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">Specific Student</span>
                      </label>
                    </div>

                    {/* Class Selection */}
                    {assignmentForm.assign_to === 'class' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Class *</label>
                        <select
                          value={assignmentForm.class_grade}
                          onChange={(e) => setAssignmentForm({...assignmentForm, class_grade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={assignmentForm.assign_to === 'class'}
                        >
                          <option value="">Select Class</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                            <option key={grade} value={grade.toString()}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Student Selection */}
                    {assignmentForm.assign_to === 'student' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                        <select
                          value={assignmentForm.student_id}
                          onChange={(e) => setAssignmentForm({...assignmentForm, student_id: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={assignmentForm.assign_to === 'student'}
                        >
                          <option value="">Select Student</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.name} (Class {student.grade})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={assignmentForm.due_date}
                      onChange={(e) => setAssignmentForm({...assignmentForm, due_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={assignmentForm.total_marks}
                      onChange={(e) => setAssignmentForm({...assignmentForm, total_marks: parseInt(e.target.value) || 100})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the assignment requirements, instructions, and expectations..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal (for parents) */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Submit Assignment</h3>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">{selectedAssignment.title}</h4>
                <p className="text-blue-700 text-sm mb-2">{selectedAssignment.subject} • {selectedAssignment.assignment_type}</p>
                <p className="text-blue-600 text-sm">{selectedAssignment.description}</p>
              </div>

              <form onSubmit={handleSubmitAssignment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                  <select
                    value={submissionForm.student_id}
                    onChange={(e) => setSubmissionForm({...submissionForm, student_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.length > 0 ? students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} (Class {student.grade})
                      </option>
                    )) : (
                      <option value={userId}>{`Student (ID: ${userId})`}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submission Text *</label>
                  <textarea
                    value={submissionForm.submission_text}
                    onChange={(e) => setSubmissionForm({...submissionForm, submission_text: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your assignment submission here..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal (for teachers) */}
      {showGradeModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Grade Assignment</h3>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">{selectedAssignment.title}</h4>
                <p className="text-green-700 text-sm mb-2">
                  Total Marks: {selectedAssignment.total_marks} • Type: {selectedAssignment.assignment_type}
                </p>
                <p className="text-green-600 text-sm">{selectedAssignment.description}</p>
              </div>

              <form onSubmit={handleGradeAssignment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                  <select
                    value={gradeForm.student_id}
                    onChange={(e) => setGradeForm({...gradeForm, student_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} (Class {student.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade (out of {selectedAssignment.total_marks}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedAssignment.total_marks}
                    value={gradeForm.grade_received}
                    onChange={(e) => setGradeForm({...gradeForm, grade_received: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter grade (0-${selectedAssignment.total_marks})`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (Optional)</label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide feedback on the student's work..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Submit Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
