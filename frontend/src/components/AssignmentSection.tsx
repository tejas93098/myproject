import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Plus, Edit, Trash2, CheckCircle, AlertCircle, Star, Award, TrendingUp, Filter, SortAsc } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded';
  student_id?: number;
  student_name?: string;
  student_grade?: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  points?: number;
}

interface Student {
  id: number;
  name: string;
  grade: string;
}

interface AssignmentSectionProps {
  userRole: string;
  userId: number;
}

const AssignmentSection: React.FC<AssignmentSectionProps> = ({ userRole, userId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Mathematics Quiz - Algebra Basics',
      description: 'Complete the algebra problems covering linear equations and basic graphing concepts.',
      subject: 'Mathematics',
      due_date: '2024-01-15',
      status: 'pending',
      student_name: 'Arjun Kumar',
      created_at: '2024-01-10',
      priority: 'high',
      points: 100
    },
    {
      id: 2,
      title: 'Science Project - Renewable Energy',
      description: 'Research and create a presentation on renewable energy sources including solar, wind, and hydroelectric power.',
      subject: 'Science',
      due_date: '2024-01-20',
      status: 'submitted',
      student_name: 'Kavya Patel',
      created_at: '2024-01-08',
      priority: 'medium',
      points: 150
    },
    {
      id: 3,
      title: 'English Essay - Environmental Conservation',
      description: 'Write a 500-word essay on the importance of environmental conservation and personal responsibility.',
      subject: 'English',
      due_date: '2024-01-12',
      status: 'graded',
      student_name: 'Rohan Gupta',
      student_grade: 'A',
      created_at: '2024-01-05',
      priority: 'medium',
      points: 75
    },
    {
      id: 4,
      title: 'History Timeline - Ancient Civilizations',
      description: 'Create a detailed timeline of ancient civilizations including key events, rulers, and cultural achievements.',
      subject: 'History',
      due_date: '2024-01-25',
      status: 'pending',
      student_name: 'Isha Joshi',
      created_at: '2024-01-11',
      priority: 'low',
      points: 120
    }
  ]);
  
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Arjun Kumar', grade: '10th' },
    { id: 2, name: 'Kavya Patel', grade: '9th' },
    { id: 3, name: 'Rohan Gupta', grade: '10th' },
    { id: 4, name: 'Isha Joshi', grade: '9th' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('due_date');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    due_date: '',
    student_id: '',
    priority: 'medium',
    points: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssignment: Assignment = {
      id: assignments.length + 1,
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      due_date: formData.due_date,
      status: 'pending',
      student_id: formData.student_id ? parseInt(formData.student_id) : undefined,
      student_name: formData.student_id ? students.find(s => s.id === parseInt(formData.student_id))?.name : undefined,
      created_at: new Date().toISOString(),
      priority: formData.priority as 'low' | 'medium' | 'high',
      points: formData.points
    };

    if (editingAssignment) {
      setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? { ...newAssignment, id: editingAssignment.id } : a));
    } else {
      setAssignments(prev => [...prev, newAssignment]);
    }

    setShowAddForm(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      subject: '',
      due_date: '',
      student_id: '',
      priority: 'medium',
      points: 100
    });
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      due_date: assignment.due_date,
      student_id: assignment.student_id?.toString() || '',
      priority: assignment.priority || 'medium',
      points: assignment.points || 100
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'graded':
        return <Award className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'graded':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status === 'pending';
  };

  const filteredAndSortedAssignments = assignments
    .filter(assignment => filterStatus === 'all' || assignment.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

  const getStats = () => {
    const total = assignments.length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const submitted = assignments.filter(a => a.status === 'submitted').length;
    const graded = assignments.filter(a => a.status === 'graded').length;
    const overdue = assignments.filter(a => isOverdue(a.due_date, a.status)).length;
    
    return { total, pending, submitted, graded, overdue };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
            <p className="text-gray-600">Manage and track student assignments</p>
          </div>
        </div>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Assignment</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Submitted</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.submitted}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Graded</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.graded}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="subject">Subject</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border-2 border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Subject name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Detailed assignment description and instructions"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign to Student (Optional)
              </label>
              <select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.grade}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAssignment(null);
                  setFormData({
                    title: '',
                    description: '',
                    subject: '',
                    due_date: '',
                    student_id: '',
                    priority: 'medium',
                    points: 100
                  });
                }}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAndSortedAssignments.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No assignments found</p>
            <p className="text-gray-500">Create your first assignment to get started</p>
          </div>
        ) : (
          filteredAndSortedAssignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className={`border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                isOverdue(assignment.due_date, assignment.status) 
                  ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg' 
                  : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(assignment.priority || 'medium')}`}>
                      {(assignment.priority || 'medium').charAt(0).toUpperCase() + (assignment.priority || 'medium').slice(1)} Priority
                    </span>
                    {getStatusIcon(assignment.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{assignment.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-gray-700">{assignment.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-700">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                    {assignment.student_name && (
                      <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Student: {assignment.student_name}</span>
                      </div>
                    )}
                    {assignment.points && (
                      <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-gray-700">{assignment.points} pts</span>
                      </div>
                    )}
                    {assignment.student_grade && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-lg shadow-sm border border-green-200">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-800">Grade: {assignment.student_grade}</span>
                      </div>
                    )}
                    {isOverdue(assignment.due_date, assignment.status) && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-lg shadow-sm border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-red-800">Overdue</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {userRole === 'teacher' && (
                  <div className="flex space-x-2 ml-6">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-3 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-3 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AssignmentSection;