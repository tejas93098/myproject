import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { managementAPI, performanceAPI } from '../utils/api';
import { toast } from 'react-toastify';
import PerformanceDashboard from './PerformanceDashboard';

import { 
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  BookOpen,
  MessageSquare,
  DollarSign,
  FileText,
  Upload,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Eye,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Activity,
  Target,
  Zap,
  Shield,
  Globe,
  Home,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Send,
  LogOut,
  Menu,
  X,
  Bus,
  BookMarked,
  Megaphone,
  ClipboardCheck,
  UserPlus,
  School,
  Building,
  CreditCard,
  Receipt,
  Calendar as CalendarIcon,
  BarChart,
  LineChart,
  Database,
  RefreshCw,
  ExternalLink,
  Archive,
  Bookmark,
  Tag,
  Flag,
  Heart,
  Coffee,
  Lightbulb,
  Sparkles,
  Trophy,
  Flame,
  Rocket,
  Timer,
  Save,
  User
} from 'lucide-react';

// Types and Interfaces
interface Student {
  id: number;
  name: string;
  grade: string;
  email: string;
  parent_contact: string;
  admission_date: string;
  status: 'active' | 'inactive' | 'graduated';
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  experience: number;
  status: 'active' | 'inactive';
  hire_date: string;
}

interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_parents: number;
  fees_collected: number;
  fees_pending: number;
  attendance_rate: number;
  active_classes: number;
  total_staff: number;
  monthly_revenue: number;
  pending_admissions: number;
  library_books: number;
  transport_routes: number;
}

interface FeeRecord {
  id: number;
  student_id: number;
  student_name: string;
  amount: number;
  fee_type: string;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: string;
}

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  grade: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}


interface PerformanceData {
  id: number;
  student_id: number;
  student_name: string;
  subject: string;
  score: number;
  grade: string;
  exam_type: string;
  date: string;
  student_grade?: string;
}

interface LibraryRecord {
  id: number;
  book_title: string;
  book_isbn: string;
  student_name: string;
  issue_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue';
}

interface TransportRoute {
  id: number;
  route_name: string;
  driver_name: string;
  bus_number: string;
  students_count: number;
  status: 'active' | 'inactive';
}

interface AcademicPerformance {
  id?: number;
  student_id: number;
  study_streak: number;
  weekly_study_hours: number;
  monthly_study_hours: number;
  achievements: string[];
  class_rank?: number;
  total_students_in_class?: number;
  updated_at?: string;
}

// Enhanced Premium 3D Management ID Card Component
const ManagementIDCard: React.FC<{ manager: any; stats?: DashboardStats | null }> = ({ manager, stats }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const tiltX = (e.clientY - centerY) / 15;
    const tiltY = (centerX - e.clientX) / 15;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const toggleCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
      <div className="perspective-1000">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggleCard}
          className="relative transition-all duration-700 ease-out cursor-pointer transform-style-preserve-3d"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
              isHovered ? 'scale(1.03)' : 'scale(1)'
            } ${isFlipped ? 'rotateY(180deg)' : ''}`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front of Card */}
          <div
            className={`relative w-full h-96 sm:h-[28rem] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            } backface-hidden`}
          >
            {/* Premium Executive Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Elegant Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white to-transparent rounded-full -translate-y-36 translate-x-36"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-amber-400/30 to-transparent rounded-full translate-y-28 -translate-x-28"></div>
              <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full"></div>
            </div>

            {/* Executive Header */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <Building className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-lg sm:text-xl tracking-wide">MyUniOne</h3>
                  <p className="text-yellow-200 text-sm font-medium">EXECUTIVE</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-200 text-xs font-medium">ACADEMIC YEAR</p>
                <p className="text-amber-400 font-bold text-lg">2024-25</p>
              </div>
            </div>

            {/* Executive Information */}
            <div className="relative z-10 px-6 sm:px-8 pt-6 flex items-start space-x-6">
              <div className="relative flex-shrink-0">
                {/* Executive Avatar with Gold Border */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-[3px] shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                    <User className="w-12 h-12 sm:w-14 sm:h-14 text-amber-300" />
                  </div>
                </div>
                
                {/* Executive Badges */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-3 border-gray-900 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-600 rounded-full border-3 border-gray-900 flex items-center justify-center shadow-lg">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pt-2">
                <h4 className="text-amber-400 font-bold text-2xl sm:text-3xl leading-tight mb-1 tracking-wide">
                  {manager.name}
                </h4>
                <p className="text-yellow-200 font-semibold text-lg sm:text-xl mb-2">
                  Executive Director
                </p>
                <p className="text-yellow-300 text-sm sm:text-base mb-3 font-mono">
                  ID: EX{manager.id.toString().padStart(4, '0')}
                </p>
                
                {/* Management Metrics */}
                <div className="flex items-center space-x-4 text-yellow-200 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{stats?.total_students || 0} Students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-4 h-4" />
                    <span className="font-medium">{stats?.total_teachers || 0} Faculty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Contact Information */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-amber-500/20 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/30">
                      <Mail className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-yellow-200 font-medium uppercase tracking-wide">Email</p>
                      <span className="text-amber-400 font-medium truncate block">{manager.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/30">
                      <Phone className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <p className="text-xs text-yellow-200 font-medium uppercase tracking-wide">Phone</p>
                      <span className="text-amber-400 font-medium">+91 98765 43210</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:col-span-2">
                    <div className="w-8 h-8 bg-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/30 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-yellow-200 font-medium uppercase tracking-wide">Office</p>
                      <span className="text-amber-400 font-medium truncate block">Executive Suite, Administrative Block</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card - Executive Dashboard */}
          <div
            className={`absolute inset-0 w-full h-96 sm:h-[28rem] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            } backface-hidden`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Executive Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-36 -translate-x-36"></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-amber-400/30 to-transparent rounded-full translate-y-28 translate-x-28"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-6 border-b border-white/10 pb-6">
                <h3 className="text-amber-400 font-bold text-xl mb-2 tracking-wide">EXECUTIVE OVERVIEW</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="flex-1 space-y-6">
                {/* Institution Statistics */}
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-amber-400 flex items-center">
                      <School className="w-5 h-5 mr-2 text-amber-400" />
                      INSTITUTION METRICS
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-amber-400">{stats?.total_students || 0}</div>
                      <div className="text-yellow-200 text-xs">Active Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-400">{stats?.total_teachers || 0}</div>
                      <div className="text-yellow-200 text-xs">Faculty Members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Footer Branding */}
             <div className="mt-6 text-center">
                             <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                               <Shield className="w-4 h-4 text-amber-400" />
                               <span className="text-xs text-slate-300">
                                 Powered by <span className="text-amber-400 font-semibold"> MyUniOne</span>
                               </span>
                             </div>
                           </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Status Indicators */}
      <div className="text-center mt-6 px-4">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200 shadow-lg">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="font-bold text-gray-800">EXECUTIVE ACCESS</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200 shadow-lg">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-gray-800">VALID 2024-25</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200 shadow-lg">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-gray-800">AUTHORIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Performance Management Component for Management Dashboard
const PerformanceManager: React.FC<{ 
  students: Student[]; 
  onClose: () => void;
}> = ({ students, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [performanceData, setPerformanceData] = useState<AcademicPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [performanceForm, setPerformanceForm] = useState({
    study_streak: 0,
    weekly_study_hours: 0,
    monthly_study_hours: 0,
    achievements: [] as string[],
    class_rank: '',
    total_students_in_class: ''
  });

  const [newAchievement, setNewAchievement] = useState('');

  const fetchStudentPerformance = async (studentId: number) => {
    setLoading(true);
    try {
      const response = await performanceAPI.getByStudent(studentId);
      const data = response.data;
      
      if (data) {
        setPerformanceData(data);
        setPerformanceForm({
          study_streak: data.study_streak || 0,
          weekly_study_hours: data.weekly_study_hours || 0,
          monthly_study_hours: data.monthly_study_hours || 0,
          achievements: data.achievements || [],
          class_rank: data.class_rank?.toString() || '',
          total_students_in_class: data.total_students_in_class?.toString() || ''
        });
      } else {
        setPerformanceData(null);
        setPerformanceForm({
          study_streak: 0,
          weekly_study_hours: 0,
          monthly_study_hours: 0,
          achievements: [],
          class_rank: '',
          total_students_in_class: ''
        });
      }
    } catch (error) {
      console.log('No performance data found');
      setPerformanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    if (studentId) {
      fetchStudentPerformance(parseInt(studentId));
    } else {
      setPerformanceData(null);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setPerformanceForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setPerformanceForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!selectedStudent) return;

    setSaving(true);
    try {
      const data = {
        student_id: parseInt(selectedStudent),
        study_streak: performanceForm.study_streak,
        weekly_study_hours: performanceForm.weekly_study_hours,
        monthly_study_hours: performanceForm.monthly_study_hours,
        achievements: performanceForm.achievements,
        class_rank: performanceForm.class_rank ? parseInt(performanceForm.class_rank) : undefined,
        total_students_in_class: performanceForm.total_students_in_class ? parseInt(performanceForm.total_students_in_class) : undefined
      };

      if (performanceData) {
        await performanceAPI.update(parseInt(selectedStudent), data);
      } else {
        await performanceAPI.create(data);
      }

      toast.success('Performance data saved successfully');
      fetchStudentPerformance(parseInt(selectedStudent));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save performance data');
    } finally {
      setSaving(false);
    }
  };

  const selectedStudentName = students.find(s => s.id.toString() === selectedStudent)?.name || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
              Academic Performance Manager
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Student Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Class {student.grade}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Managing Performance for: {selectedStudentName}</h4>
                <p className="text-blue-700 text-sm">
                  {performanceData ? 'Updating existing performance data' : 'Creating new performance record'}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading performance data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Study Progress */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-orange-600" />
                      Study Progress
                    </h5>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Study Streak (days)</label>
                      <input
                        type="number"
                        min="0"
                        value={performanceForm.study_streak}
                        onChange={(e) => setPerformanceForm(prev => ({ ...prev, study_streak: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Study Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={performanceForm.weekly_study_hours}
                        onChange={(e) => setPerformanceForm(prev => ({ ...prev, weekly_study_hours: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Study Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={performanceForm.monthly_study_hours}
                        onChange={(e) => setPerformanceForm(prev => ({ ...prev, monthly_study_hours: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Class Position */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-600" />
                      Class Position
                    </h5>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class Rank</label>
                      <input
                        type="number"
                        min="1"
                        value={performanceForm.class_rank}
                        onChange={(e) => setPerformanceForm(prev => ({ ...prev, class_rank: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Students in Class</label>
                      <input
                        type="number"
                        min="1"
                        value={performanceForm.total_students_in_class}
                        onChange={(e) => setPerformanceForm(prev => ({ ...prev, total_students_in_class: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 30"
                      />
                    </div>

                    {performanceForm.class_rank && performanceForm.total_students_in_class && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-green-800 font-medium">
                          Rank: {performanceForm.class_rank}
                          {parseInt(performanceForm.class_rank) === 1 ? 'st' :
                           parseInt(performanceForm.class_rank) === 2 ? 'nd' :
                           parseInt(performanceForm.class_rank) === 3 ? 'rd' : 'th'} 
                          out of {performanceForm.total_students_in_class} students
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Achievements */}
                  <div className="md:col-span-2 space-y-4">
                    <h5 className="font-semibold text-gray-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-600" />
                      Achievements
                    </h5>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder="Enter achievement (e.g., 'Science Fair Winner')"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      />
                      <button
                        onClick={addAchievement}
                        disabled={!newAchievement.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {performanceForm.achievements.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Current Achievements:</p>
                        {performanceForm.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <Award className="w-4 h-4 text-yellow-600 mr-2" />
                              <span className="text-gray-900">{achievement}</span>
                            </div>
                            <button
                              onClick={() => removeAchievement(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selectedStudent || saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Performance Data
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Stats Card Component with animations
const AnimatedStatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  subtitle?: string;
  delay?: number;
}> = ({ title, value, icon: Icon, color, bgColor, change, changeType, subtitle, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
            if (!isNaN(numericValue)) {
              let start = 0;
              const duration = 2000;
              const increment = numericValue / (duration / 16);
              
              const timer = setInterval(() => {
                start += increment;
                if (start >= numericValue) {
                  setAnimatedValue(numericValue);
                  clearInterval(timer);
                } else {
                  setAnimatedValue(Math.floor(start));
                }
              }, 16);
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value, delay]);

  const formatValue = (val: number) => {
    if (typeof value === 'string' && value.includes('$')) {
      return `$${val.toLocaleString()}`;
    }
    if (typeof value === 'string' && value.includes('%')) {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 ${bgColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-4 -right-4 w-24 h-24 ${bgColor} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${bgColor} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {change && (
            <div className={`flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">{change}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'string' && !value.match(/^\d+$/) ? value : formatValue(animatedValue)}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Feature Box Component
const FeatureBox: React.FC<{
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  gradient: string;
  badge?: number;
  description?: string;
  delay?: number;
}> = ({ title, icon: Icon, onClick, gradient, badge, description, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={boxRef}
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            
            {badge && badge > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                {badge}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300 mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-white/80 text-sm drop-shadow-sm">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Back Button Component
const BackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = "Back to Dashboard" }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onClick}
        className="group flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <Home className="w-4 h-4 mr-2" />
        <span className="font-semibold">{label}</span>
      </button>
    </div>
  );
};

const ManagementDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showPerformanceManager, setShowPerformanceManager] = useState(false);
  
  // State for all data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [library, setLibrary] = useState<LibraryRecord[]>([]);
  const [transport, setTransport] = useState<TransportRoute[]>([]);

  // Form states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddFee, setShowAddFee] = useState(false);


  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Form data states
  const [studentForm, setStudentForm] = useState({
    name: '',
    grade: '',
    email: '',
    parent_contact: '',
  });

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    classes: [] as string[],
    experience: 0,
  });

  const [feeForm, setFeeForm] = useState({
    student_id: '',
    amount: '',
    fee_type: '',
    due_date: '',
  });



  // Load all data on component mount
  useEffect(() => {
    if (user?.role !== 'management') {
      toast.error('Access denied. Management role required.');
      return;
    }
    fetchAllData();
  }, [user]);

  // Fetch all data from backend
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchStudents(),
        fetchTeachers(),
        fetchFees(),
        fetchAttendance(),
        fetchPerformance(),
        fetchLibrary(),
        fetchTransport(),
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Individual fetch functions with proper error handling
  const fetchStats = async () => {
    try {
      const response = await managementAPI.getStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      const errorMessage = error.response?.data?.error || 'Failed to fetch dashboard statistics';
      toast.error(errorMessage);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await managementAPI.getStudents();
      setStudents(response.data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await managementAPI.getTeachers();
      setTeachers(response.data || []);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await managementAPI.getFees();
      setFees(response.data || []);
    } catch (error: any) {
      console.error('Error fetching fees:', error);
      setFees([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await managementAPI.getAttendance();
      setAttendance(response.data || []);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    }
  };



  const fetchPerformance = async () => {
    try {
      const response = await managementAPI.getPerformance();
      // Map the data to include student_grade from the response
      const performanceData = response.data?.map((item: any) => ({
        ...item,
        student_grade: item.student_grade || item.grade // Use student_grade from response or fallback to grade
      })) || [];
      setPerformance(performanceData);
    } catch (error: any) {
      console.error('Error fetching performance:', error);
      setPerformance([]);
    }
  };

  const fetchLibrary = async () => {
    try {
      const response = await managementAPI.getLibrary();
      setLibrary(response.data || []);
    } catch (error: any) {
      console.error('Error fetching library:', error);
      setLibrary([]);
    }
  };

  const fetchTransport = async () => {
    try {
      const response = await managementAPI.getTransport();
      setTransport(response.data || []);
    } catch (error: any) {
      console.error('Error fetching transport:', error);
      setTransport([]);
    }
  };

  // Handle form submissions
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managementAPI.createStudent(studentForm);
      toast.success('Student added successfully');
      setShowAddStudent(false);
      setStudentForm({ name: '', grade: '', email: '', parent_contact: '' });
      fetchStudents();
      fetchStats();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add student';
      toast.error(errorMessage);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managementAPI.createTeacher(teacherForm);
      toast.success('Teacher added successfully');
      setShowAddTeacher(false);
      setTeacherForm({ name: '', email: '', phone: '', subjects: [], classes: [], experience: 0 });
      fetchTeachers();
      fetchStats();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add teacher';
      toast.error(errorMessage);
    }
  };

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await managementAPI.createFee({
        ...feeForm,
        amount: parseFloat(feeForm.amount),
      });
      toast.success('Fee record created successfully');
      setShowAddFee(false);
      setFeeForm({ student_id: '', amount: '', fee_type: '', due_date: '' });
      fetchFees();
      fetchStats();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create fee record';
      toast.error(errorMessage);
    }
  };



  // Delete functions
  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await managementAPI.deleteStudent(studentId);
        toast.success('Student deleted successfully');
        fetchStudents();
        fetchStats();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete student';
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await managementAPI.deleteTeacher(teacherId);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
        fetchStats();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete teacher';
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteFee = async (feeId: number) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await managementAPI.deleteFee(feeId);
        toast.success('Fee record deleted successfully');
        fetchFees();
        fetchStats();
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete fee record';
        toast.error(errorMessage);
      }
    }
  };



  // Function to handle back navigation
  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  // Get tab title for back button
  const getTabTitle = (tab: string) => {
    const titles: { [key: string]: string } = {
      'students': 'Student Management',
      'teachers': 'Teacher Management',
      'attendance': 'Attendance Management',
      'fees': 'Fees Management',
      'performance': 'Performance & Exams',
      'library': 'Library Management',
      'transport': 'Transport Management',
      'reports': 'Reports & Analytics',
      'timetable': 'Class & Timetable'
    };
    return titles[tab] || tab;
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.warning('No data available to export');
      return;
    }

    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported to CSV successfully');
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <div className="w-8 h-8 text-blue-600 mr-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">MyUniOne</span>
            <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">ADMIN</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.name || 'Administrator'}</span>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Footer Component
  const Footer = () => (
    <footer className="footer bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="footer-section text-center sm:text-left">
            <div className="footer-logo flex items-center justify-center sm:justify-start mb-4">
              <div className="logo-icon w-8 h-8 text-blue-600 mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">MyUniOne</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">Connecting parents, students, and teachers for better educational outcomes through innovative digital solutions.</p>
          </div>
          <div className="footer-section text-center sm:text-left">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#dashboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base">Dashboard</a></li>
              <li><a href="#attendance" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base">Attendance</a></li>
              <li><a href="#grades" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base">Grades</a></li>
              <li><a href="#feedback" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base">Feedback</a></li>

            </ul>
          </div>
          <div className="footer-section text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h4>
            <div className="contact-info space-y-2">
              <div className="contact-item text-gray-600 text-sm sm:text-base">Greater Noida, India</div>
              <div className="contact-item text-gray-600 text-sm sm:text-base">support@MyUniOne.edu</div>
              <div className="contact-item text-gray-600 text-sm sm:text-base">+91 98765 43210</div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">&copy; 2025 MyUniOne Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  // Check access on first render
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please login to access the management dashboard.</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'management') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Management role required to access this dashboard.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      {/* Performance Manager Modal */}
      {showPerformanceManager && (
        <PerformanceManager 
          students={students}
          onClose={() => setShowPerformanceManager(false)}
        />
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button for non-dashboard tabs */}
        {activeTab !== 'dashboard' && (
          <BackButton 
            onClick={handleBackToDashboard} 
            label={`Back from ${getTabTitle(activeTab)}`}
          />
        )}

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">School Management Dashboard</h1>
              <p className="text-gray-600 mb-4">Complete oversight and control of your educational institution</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Academic Year 2024-25</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Management ID Card */}
            {user && (
              <ManagementIDCard manager={user} stats={stats} />
            )}

            {/* Enhanced Stats Grid */}
            {stats && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">School Overview</h2>
                
                {/* Primary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <AnimatedStatsCard
                    title="Total Students"
                    value={stats.total_students}
                    icon={Users}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                    change={5.2}
                    changeType="increase"
                    subtitle="Active enrollment"
                    delay={0}
                  />
                  
                  <AnimatedStatsCard
                    title="Total Teachers"
                    value={stats.total_teachers}
                    icon={UserCheck}
                    color="text-green-600"
                    bgColor="bg-green-100"
                    change={2.1}
                    changeType="increase"
                    subtitle="Active faculty"
                    delay={100}
                  />
                  
                  <AnimatedStatsCard
                    title="Fees Collected"
                    value={`$${stats.fees_collected}`}
                    icon={Receipt}
                    color="text-emerald-600"
                    bgColor="bg-emerald-100"
                    change={12.5}
                    changeType="increase"
                    subtitle="This term"
                    delay={200}
                  />
                  
                  <AnimatedStatsCard
                    title="Pending Fees"
                    value={`$${stats.fees_pending}`}
                    icon={AlertCircle}
                    color="text-red-600"
                    bgColor="bg-red-100"
                    change={3.2}
                    changeType="decrease"
                    subtitle="Outstanding"
                    delay={300}
                  />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatedStatsCard
                    title="Attendance Rate"
                    value={`${stats.attendance_rate}%`}
                    icon={Calendar}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                    change={1.8}
                    changeType="increase"
                    subtitle="This month"
                    delay={400}
                  />
                  
                  <AnimatedStatsCard
                    title="Active Classes"
                    value={stats.active_classes}
                    icon={School}
                    color="text-indigo-600"
                    bgColor="bg-indigo-100"
                    subtitle="Running"
                    delay={500}
                  />
                </div>
              </div>
            )}

            {/* Feature Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Management Tools</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <FeatureBox
                  title="Students"
                  icon={Users}
                  onClick={() => setActiveTab('students')}
                  gradient="from-blue-500 to-cyan-600"
                  description="Manage student records"
                  delay={0}
                />

                <FeatureBox
                  title="Teachers"
                  icon={UserCheck}
                  onClick={() => setActiveTab('teachers')}
                  gradient="from-green-500 to-emerald-600"
                  description="Faculty management"
                  delay={100}
                />

                <FeatureBox
                  title="Fees"
                  icon={DollarSign}
                  onClick={() => setActiveTab('fees')}
                  gradient="from-orange-500 to-red-600"
                  description="Financial management"
                  delay={200}
                />


                <FeatureBox
                  title="Performance"
                  icon={BarChart3}
                  onClick={() => setActiveTab('performance')}
                  gradient="from-violet-500 to-purple-600"
                  description="Academic performance"
                  delay={400}
                />


                {/* NEW: Performance Manager Feature */}
                <FeatureBox
                  title="Performance Manager"
                  icon={Trophy}
                  onClick={() => setShowPerformanceManager(true)}
                  gradient="from-amber-500 to-yellow-600"
                  description="Manage academic performance"
                  delay={800}
                />
              </div>
            </div>
          </div>
        )}

        {/* Student Management Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <div className="flex gap-4">
                <div className="relative group">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={() => exportToCSV(students, 'students_report')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export as CSV
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddStudent(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Student
                </button>
                {/* NEW: Performance Manager Button */}
                <button
                  onClick={() => setShowPerformanceManager(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Manage Performance
                </button>
              </div>
            </div>

            {/* Add Student Form */}
            {showAddStudent && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select
                      value={studentForm.grade}
                      onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Grade</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map(grade => (
                        <option key={grade} value={grade.toString()}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                    <input
                      type="tel"
                      value={studentForm.parent_contact}
                      onChange={(e) => setStudentForm({...studentForm, parent_contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddStudent(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Classes</option>
                  {Array.from({length: 12}, (_, i) => i + 1).map(grade => (
                    <option key={grade} value={grade.toString()}>Class {grade}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>

                <button
                  onClick={fetchStudents}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {students
                      .filter(student => 
                        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (selectedClass === '' || student.grade === selectedClass) &&
                        (selectedStatus === '' || student.status === selectedStatus)
                      )
                      .map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Class {student.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.parent_contact}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' :
                            student.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {students.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teachers Management Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => exportToCSV(teachers, 'teachers_report')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAddTeacher(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Teacher
                </button>
              </div>
            </div>

            {/* Add Teacher Form */}
            {showAddTeacher && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Add New Teacher</h3>
                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={teacherForm.phone}
                      onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                    <input
                      type="number"
                      min="0"
                      value={teacherForm.experience}
                      onChange={(e) => setTeacherForm({...teacherForm, experience: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddTeacher(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Teacher
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Teachers Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {teacher.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-sm text-gray-500">{teacher.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : teacher.subjects}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.experience} years</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {teachers.length === 0 && (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No teachers found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fees Management Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Fees Management</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => exportToCSV(fees, 'fees_report')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAddFee(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Fee Record
                </button>
              </div>
            </div>

            {/* Add Fee Form */}
            {showAddFee && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Add New Fee Record</h3>
                <form onSubmit={handleAddFee} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <select
                      value={feeForm.student_id}
                      onChange={(e) => setFeeForm({...feeForm, student_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name} - Class {student.grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={feeForm.amount}
                      onChange={(e) => setFeeForm({...feeForm, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                    <select
                      value={feeForm.fee_type}
                      onChange={(e) => setFeeForm({...feeForm, fee_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Fee Type</option>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Library Fee">Library Fee</option>
                      <option value="Sports Fee">Sports Fee</option>
                      <option value="Lab Fee">Lab Fee</option>
                      <option value="Transport Fee">Transport Fee</option>
                      <option value="Exam Fee">Exam Fee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={feeForm.due_date}
                      onChange={(e) => setFeeForm({...feeForm, due_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddFee(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Fee Record
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Fees Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {fees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fee.student_name}</div>
                          {/* <div className="text-sm text-gray-500">Class {fee.grade}</div> */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.fee_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${fee.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.due_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                            fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFee(fee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fees.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No fee records found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Management Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
              <button
                onClick={() => exportToCSV(attendance, 'attendance_report')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* Attendance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Present Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {attendance.filter(record => 
                        record.date === new Date().toISOString().split('T')[0] && 
                        record.status === 'present'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Absent Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {attendance.filter(record => 
                        record.date === new Date().toISOString().split('T')[0] && 
                        record.status === 'absent'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Late Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {attendance.filter(record => 
                        record.date === new Date().toISOString().split('T')[0] && 
                        record.status === 'late'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {attendance.slice(0, 50).map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.student_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Class {record.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {attendance.length === 0 && (
                <div className="text-center py-8">
                  <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No attendance records found</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Performance Management Tab - NEW ANALYTICS DASHBOARD */}
        {activeTab === 'performance' && (
          <PerformanceDashboard
            performance={performance}
            loading={loading}
            onExportCSV={exportToCSV}
            onRefresh={fetchPerformance}
          />
        )}

 
      </main>

      <Footer />
    </div>
  );
};

export default ManagementDashboard;
