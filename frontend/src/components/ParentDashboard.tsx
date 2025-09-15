import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, studentAPI, attendanceAPI, gradeAPI, feedbackAPI, performanceAPI } from '../utils/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
// import QRCode from 'qrcode.react';
import SchedulePage from './SchedulePage';
import FeesPage from './FeesPage';
import AssignmentSection from './AssignmentSection';

import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  LogOut,
  User,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Globe,
  ChevronRight,
  Download,
  FileText,
  Menu,
  X,
  MessageCircle,
  Megaphone,
  Search,
  Filter,
  Bell,
  AlertCircle,
  Info,
  CheckCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
  Calendar as CalendarIcon,
  BookOpenCheck,
  Target,
  Zap,
  BarChart3,
  PieChart,
  TrendingDown,
  BookMarked,
  ClipboardCheck,
  Timer,
  Flame,
  Trophy,
  Brain,
  Lightbulb,
  Sparkles,
  Rocket,
  Heart,
  ThumbsUp,
  Coffee,
  Sunrise,
  Moon,
  ArrowLeft,
  Home,
  CreditCard
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  grade: string;
  email: string;
}

interface Grade {
  id: number;
  subject: string;
  score: number;
  grade: string;
  date: string;
  student_name: string;
}

interface Feedback {
  id: number;
  subject: string;
  message: string;
  rating: number;
  date: string;
  student_name: string;
}

interface Attendance {
  id: number;
  date: string;
  status: string;
  student_name: string;
}

interface DashboardStats {
  attendance_rate: number;
  grade_average: number;
  total_feedback: number;
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

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  date: string;
  author: string;
  isRead: boolean;
  targetGrades: string[];
}

// Enhanced Premium 3D Student ID Card Component
const StudentIDCard: React.FC<{ 
  student: Student; 
  stats?: DashboardStats | null;
  performance?: AcademicPerformance | null;
}> = ({ student, stats, performance }) => {
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
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Elegant Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
              <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full"></div>
            </div>

            {/* University Header */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg sm:text-xl tracking-wide">MY UNIONE</h3>
                  <p className="text-blue-200 text-sm font-medium">UNIVERSITY</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs font-medium">ACADEMIC YEAR</p>
                <p className="text-white font-bold text-lg">2024-25</p>
              </div>
            </div>

            {/* Student Information */}
            <div className="relative z-10 px-6 sm:px-8 pt-6 flex items-start space-x-6">
              <div className="relative flex-shrink-0">
                {/* Premium Avatar with Gradient Border */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 p-[3px] shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                    <User className="w-12 h-12 sm:w-14 sm:h-14 text-blue-300" />
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-3 border-slate-900 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-3 border-slate-900 flex items-center justify-center shadow-lg">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pt-2">
                <h4 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-1 tracking-wide">
                  {student.name}
                </h4>
                <p className="text-blue-200 font-semibold text-lg sm:text-xl mb-2">
                  Student - Class {student.grade}
                </p>
                <p className="text-blue-300 text-sm sm:text-base mb-3 font-mono">
                  ID: {student.id.toString().padStart(6, '0')}
                </p>
                
                {/* Performance Indicators */}
                <div className="flex items-center space-x-4 text-blue-200 text-sm">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">{stats?.attendance_rate || 0}% Present</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">{stats?.grade_average || 0}% Avg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information - Premium Card Style */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/30">
                      <Mail className="w-4 h-4 text-blue-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-200 font-medium uppercase tracking-wide">Email</p>
                      <span className="text-white font-medium truncate block">{student.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/30">
                      <Phone className="w-4 h-4 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 font-medium uppercase tracking-wide">Phone</p>
                      <span className="text-white font-medium">+91 98765 43210</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:col-span-2">
                    <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-400/30 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-200 font-medium uppercase tracking-wide">Address</p>
                      <span className="text-white font-medium truncate block">Greater Noida, Uttar Pradesh, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card - Performance Analytics */}
          <div
            className={`absolute inset-0 w-full h-96 sm:h-[28rem] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            } backface-hidden`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Premium Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-32 -translate-x-32"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full translate-y-24 translate-x-24"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-6 border-b border-white/10 pb-6">
                <h3 className="text-white font-bold text-xl mb-2 tracking-wide">ACADEMIC PERFORMANCE</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
              </div>

              <div className="flex-1 space-y-6">
                {performance ? (
                  <>
                    {/* Class Ranking */}
                    {performance.class_rank && (
                      <div className="bg-black/30 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-white flex items-center">
                            <Trophy className="w-5 h-5 mr-2 text-amber-400" />
                            CLASS RANKING
                          </h4>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-amber-400 mb-1">
                            #{performance.class_rank}
                          </div>
                          {performance.total_students_in_class && (
                            <div className="text-blue-200 text-sm font-medium">
                              out of {performance.total_students_in_class} students
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Study Progress */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg">
                        <div className="flex items-center mb-2">
                          <Flame className="w-4 h-4 text-orange-400 mr-2" />
                          <h5 className="text-white text-sm font-semibold">STREAK</h5>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">{performance.study_streak}</div>
                        <div className="text-xs text-blue-200">days</div>
                      </div>
                      
                      <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg">
                        <div className="flex items-center mb-2">
                          <Timer className="w-4 h-4 text-green-400 mr-2" />
                          <h5 className="text-white text-sm font-semibold">WEEKLY</h5>
                        </div>
                        <div className="text-2xl font-bold text-green-400">{performance.weekly_study_hours}</div>
                        <div className="text-xs text-blue-200">hours</div>
                      </div>
                    </div>

                    {/* Latest Achievement */}
                    {performance.achievements && performance.achievements.length > 0 && (
                      <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-yellow-400" />
                          LATEST ACHIEVEMENT
                        </h4>
                        <div className="text-blue-200 text-sm leading-relaxed">
                          {performance.achievements[0]}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10 text-center">
                    <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-semibold mb-2">Performance Tracking</h4>
                    <p className="text-blue-200 text-sm">Academic performance data will be updated by your teachers</p>
                  </div>
                )}
              </div>

              {/* Footer Branding */}
              <div className="mt-6 text-center border-t border-white/10 pt-4">
                <p className="text-xs text-blue-200 font-medium tracking-wide">
                  POWERED BY <span className="text-white font-bold">MY UNIONE</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Status Indicators */}
      <div className="text-center mt-6 px-4">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-lg">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="font-semibold text-slate-700">ACTIVE STUDENT</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-lg">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">VALID 2024-25</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 shadow-lg">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stats Card Component with Animations
const AnimatedStatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  delay?: number;
}> = ({ title, value, icon: Icon, color, bgColor, progress, trend, subtitle, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            // Animate the number
            const numericValue = typeof value === 'string' ? parseFloat(value) : value;
            if (!isNaN(numericValue)) {
              let start = 0;
              const duration = 1500;
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

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${bgColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-4 -right-4 w-24 h-24 ${bgColor} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 ${bgColor} opacity-5 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500`}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${bgColor} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {getTrendIcon()}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">
              {typeof value === 'string' ? value : animatedValue}
              {typeof value === 'number' && value.toString().includes('%') ? '%' : ''}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 ${bgColor} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: isVisible ? `${progress}%` : '0%',
                  transitionDelay: `${delay + 500}ms`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
};

// Enhanced Feature Box Component
const FeatureBox: React.FC<{
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  gradient: string;
  hoverGradient: string;
  badge?: number;
  delay?: number;
}> = ({ title, icon: Icon, onClick, gradient, hoverGradient, badge, delay = 0 }) => {
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
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-white/20`}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            
            {badge && badge > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                {badge}
              </div>
            )}
          </div>
          
          <h3 className="text-white font-semibold text-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
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

const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [performance, setPerformance] = useState<AcademicPerformance | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<number | null>(null);

  // Mock announcements data - in real app, this would come from API
  const mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: "🎉 Annual Sports Day - February 15th",
      content: "We are excited to announce our Annual Sports Day! All students are encouraged to participate in various sporting activities. Parents are welcome to attend and cheer for their children. Registration forms are available at the front office. Please ensure your child brings sports attire and water bottles. Event starts at 9:00 AM sharp.",
      priority: 'high',
      category: 'Events',
      date: '2025-01-15',
      author: 'Principal Johnson',
      isRead: false,
      targetGrades: ['1', '2', '3', '4', '5']
    },
    {
      id: 2,
      title: "📚 Parent-Teacher Conference Scheduled",
      content: "Parent-Teacher conferences have been scheduled for January 25-27. Please book your slot through the school portal. Discuss your child's academic progress, behavior, and any concerns you might have. Each session is 15 minutes long.",
      priority: 'urgent',
      category: 'Academic',
      date: '2025-01-10',
      author: 'Academic Coordinator',
      isRead: true,
      targetGrades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      id: 3,
      title: "🚌 Transportation Route Changes",
      content: "Due to road construction on Maple Street, Bus Route #7 will be temporarily modified. The new route will include an additional stop at Pine Avenue. Please note the revised pickup times. Changes effective from January 20th to March 1st.",
      priority: 'medium',
      category: 'Transportation',
      date: '2025-01-12',
      author: 'Transport Manager',
      isRead: false,
      targetGrades: ['6', '7', '8', '9', '10']
    },
    {
      id: 4,
      title: "🍕 New Lunch Menu Options Available",
      content: "We've added healthy and delicious new options to our cafeteria menu! Check out the vegetarian pasta, fresh salad bar, and fruit smoothies. Nutritional information is posted on our website. Special dietary requirements can be accommodated with advance notice.",
      priority: 'low',
      category: 'Cafeteria',
      date: '2025-01-08',
      author: 'Cafeteria Staff',
      isRead: true,
      targetGrades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      id: 5,
      title: "🔬 Science Fair Registration Open",
      content: "The annual Science Fair is approaching! Students can now register their projects. Themes include Environment, Technology, Health, and Space. Registration deadline is February 1st. Prizes will be awarded in each category. Let's encourage our young scientists!",
      priority: 'high',
      category: 'Academic',
      date: '2025-01-13',
      author: 'Science Department',
      isRead: false,
      targetGrades: ['4', '5', '6', '7', '8', '9', '10']
    },
    {
      id: 6,
      title: "❄️ Winter Break Holiday Schedule",
      content: "Winter break begins December 23rd and classes resume January 8th. The office will be closed from December 24th to January 2nd. Emergency contact information is available on our website. Have a wonderful holiday season with your families!",
      priority: 'medium',
      category: 'Holiday',
      date: '2025-01-05',
      author: 'Administration',
      isRead: true,
      targetGrades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    }
  ];

  useEffect(() => {
    setAnnouncements(mockAnnouncements);
  }, []);

  // Function to handle back navigation
  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  // Get tab title for back button
  const getTabTitle = (tab: string) => {
    const titles: { [key: string]: string } = {
      'attendance': 'Attendance',
      'grades': 'Grades', 
      'feedback': 'Feedback',
      'schedule': 'Schedule',
      'fees': 'Fees',
      'assignments': 'Assignments',
      'communication': 'Communication',
      'announcements': 'Announcements'
    };
    return titles[tab] || tab;
  };

  // Get current user's student data
  const getCurrentUserStudent = () => {
    return students.find(student => student.email === user?.email) || students[0];
  };

  // Filter data for current user's student
  const getFilteredAttendance = () => {
    const currentStudent = getCurrentUserStudent();
    if (!currentStudent) return [];
    return attendance.filter(record => record.student_name === currentStudent.name);
  };

  const getFilteredGrades = () => {
    const currentStudent = getCurrentUserStudent();
    if (!currentStudent) return [];
    return grades.filter(grade => grade.student_name === currentStudent.name);
  };

  const getFilteredFeedback = () => {
    const currentStudent = getCurrentUserStudent();
    if (!currentStudent) return [];
    return feedback.filter(fb => fb.student_name === currentStudent.name);
  };

  // Filter announcements based on search and filters
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || announcement.category === selectedCategory;
    const matchesPriority = selectedPriority === '' || announcement.priority === selectedPriority;
    const matchesReadStatus = !showOnlyUnread || !announcement.isRead;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesReadStatus;
  });

  // Mark announcement as read
  const markAsRead = (announcementId: number) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, isRead: true }
          : announcement
      )
    );
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <Bell className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Count unread notifications
  const unreadCount = announcements.filter(a => !a.isRead).length;

  // Export functions
  const exportToPDF = (data: any[], title: string, columns: string[]) => {
    const doc = new jsPDF();
    const currentStudent = getCurrentUserStudent();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add student info
    doc.setFontSize(12);
    doc.text(`Student: ${currentStudent?.name || 'N/A'}`, 20, 35);
    doc.text(`Grade: ${currentStudent?.grade || 'N/A'}`, 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Add table
    (doc as any).autoTable({
      head: [columns],
      body: data.map(item => columns.map(col => {
        const key = col.toLowerCase().replace(' ', '_');
        return item[key] || item[col] || '';
      })),
      startY: 65,
    });
    
    doc.save(`${title.toLowerCase().replace(' ', '_')}.pdf`);
  };

  const exportToExcel = (data: any[], title: string) => {
    const currentStudent = getCurrentUserStudent();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Add student info at the top
    const studentInfo = [
      [`Student: ${currentStudent?.name || 'N/A'}`],
      [`Grade: ${currentStudent?.grade || 'N/A'}`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [''], // Empty row
    ];
    
    XLSX.utils.sheet_add_aoa(worksheet, studentInfo, { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(' ', '_')}.xlsx`);
  };

  // Fetch academic performance data
  const fetchPerformanceData = async (studentId: number) => {
    try {
      const response = await performanceAPI.getByStudent(studentId);
      setPerformance(response.data);
    } catch (error) {
      console.log('No performance data found for student');
      setPerformance(null);
    }
  };

  // Add header and footer components
  const Header = () => (
    <header className="header bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="logo flex items-center flex-shrink-0">
            <div className="logo-icon w-8 h-8 text-blue-600 mr-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span className="logo-text text-xl font-bold text-gray-900">MY UNIONE</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
            <span className="text-xs text-gray-600 sm:hidden">Hi, {user?.name?.split(' ')[0]}</span>
            <button
              onClick={logout}
              className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );

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
                <h3 className="text-lg font-semibold text-gray-900">My UniOne</h3>
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
            <p className="text-center text-gray-600 text-sm">&copy; 2025 My UniOne Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [studentsRes, gradesRes, feedbackRes, attendanceRes, statsRes] = await Promise.all([
        studentAPI.getAll(),
        gradeAPI.getAll(),
        feedbackAPI.getAll(),
        attendanceAPI.getAll(),
        dashboardAPI.getStats(),
      ]);

      setStudents(studentsRes.data);
      setGrades(gradesRes.data);
      setFeedback(feedbackRes.data);
      setAttendance(attendanceRes.data);
      setStats(statsRes.data);

      // Fetch performance data for current student
      const students = studentsRes.data as Student[];

      const currentStudent = students.find(
        (student) => student.email === user?.email
      ) || students[0];

      if (currentStudent) {
        fetchPerformanceData(currentStudent.id);
      }

    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const getAttendanceStats = () => {
    const filteredAttendance = getFilteredAttendance();
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    
    return { total, present, absent, late };
  };

  const getGradesBySubject = () => {
    const filteredGrades = getFilteredGrades();
    const subjects = filteredGrades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = [];
      }
      acc[grade.subject].push(grade);
      return acc;
    }, {} as { [key: string]: Grade[] });

    return Object.entries(subjects).map(([subject, subjectGrades]) => ({
      subject,
      grades: subjectGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      average: Math.round(subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length),
    }));
  };

  const attendanceStats = getAttendanceStats();
  const gradesBySubject = getGradesBySubject();
  const currentStudent = getCurrentUserStudent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button for non-dashboard tabs */}
        {activeTab !== 'dashboard' && (
          <BackButton 
            onClick={handleBackToDashboard} 
            label={`Back from ${getTabTitle(activeTab)}`}
          />
        )}

        {activeTab === 'schedule' && (
          <div>
            <SchedulePage />
          </div>
        )}
        
        {activeTab === 'fees' && (
          <div>
            <FeesPage />
          </div>
        )}
        
        {activeTab === 'assignments' && user && (
          <div>
            <AssignmentSection userRole="teacher" userId={user.id} />
          </div>
        )}
        


        {/* Announcements Section */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <Megaphone className="w-8 h-8 mr-3 text-blue-600" />
                  School Announcements
                </h1>
                <p className="text-gray-600 mt-2">Stay updated with the latest news and important information from school</p>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <Bell className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-600 font-medium">{unreadCount} unread notifications</span>
                </div>
              )}
            </div>

            {/* Filters and Search */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Cafeteria">Cafeteria</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Unread Toggle */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyUnread}
                      onChange={(e) => setShowOnlyUnread(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                      showOnlyUnread ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                        showOnlyUnread ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Show unread only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {filteredAnnouncements.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md hover:border-blue-200 ${
                      !announcement.isRead 
                        ? 'border-blue-200 bg-blue-50/50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {announcement.title}
                            </h3>
                            {!announcement.isRead && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(announcement.priority)}`}>
                              {getPriorityIcon(announcement.priority)}
                              <span className="ml-1 capitalize">{announcement.priority}</span>
                            </span>
                            
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full border border-purple-200">
                              {announcement.category}
                            </span>
                            
                            <span className="text-xs text-gray-500">
                              By {announcement.author} • {new Date(announcement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!announcement.isRead && (
                            <button
                              onClick={() => markAsRead(announcement.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setExpandedAnnouncement(
                              expandedAnnouncement === announcement.id ? null : announcement.id
                            )}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {expandedAnnouncement === announcement.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className={`transition-all duration-300 overflow-hidden ${
                        expandedAnnouncement === announcement.id ? 'max-h-none' : 'max-h-16'
                      }`}>
                        <p className="text-gray-700 leading-relaxed">
                          {announcement.content}
                        </p>
                      </div>

                      {/* Expand/Collapse indicator for long content */}
                      {announcement.content.length > 150 && expandedAnnouncement !== announcement.id && (
                        <div className="mt-2">
                          <button
                            onClick={() => setExpandedAnnouncement(announcement.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            Read more...
                          </button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {announcement.isRead ? 'Read' : 'Unread'}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-gray-600 hover:text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">
                            Share
                          </button>
                          <button className="text-xs text-gray-600 hover:text-green-600 px-3 py-1 rounded-full hover:bg-green-50 transition-colors">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Welcome to Your Child's Academic Journey</h1>
            
            {/* Enhanced 3D Student ID Card with Performance Data */}
            {currentStudent && (
              <StudentIDCard student={currentStudent} stats={stats} performance={performance} />
            )}

            {/* Enhanced Stats Section with New Performance Fields */}
            {stats && (
              <div className="mb-8 sm:mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Academic Performance Overview</h2>
                  <p className="text-gray-600">Track your child's progress across all key metrics</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <AnimatedStatsCard
                    title="Attendance Rate"
                    value={`${stats.attendance_rate}%`}
                    icon={Calendar}
                    color="text-green-600"
                    bgColor="bg-green-100"
                    progress={stats.attendance_rate}
                    trend="up"
                    subtitle="This Month"
                    delay={0}
                  />

                  <AnimatedStatsCard
                    title="Grade Average"
                    value={`${stats.grade_average}%`}
                    icon={BookOpen}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                    progress={stats.grade_average}
                    trend="up"
                    subtitle="Overall"
                    delay={100}
                  />

                  <AnimatedStatsCard
                    title="Teacher Feedback"
                    value={stats.total_feedback}
                    icon={MessageSquare}
                    color="text-orange-600"
                    bgColor="bg-orange-100"
                    trend="neutral"
                    subtitle="Total Reviews"
                    delay={200}
                  />

                  <AnimatedStatsCard
                    title="Study Streak"
                    value={performance?.study_streak || 0}
                    icon={Flame}
                    color="text-red-600"
                    bgColor="bg-red-100"
                    trend="up"
                    subtitle="Days"
                    delay={300}
                  />
                </div>

                {/* Additional Stats Row - NEW PERFORMANCE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatedStatsCard
                    title="Study Hours"
                    value={performance?.weekly_study_hours || 0}
                    icon={Timer}
                    color="text-indigo-600"
                    bgColor="bg-indigo-100"
                    trend="up"
                    subtitle="This Week"
                    delay={400}
                  />

                  <AnimatedStatsCard
                    title="Monthly Hours"
                    value={performance?.monthly_study_hours || 0}
                    icon={Clock}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                    trend="up"
                    subtitle="Study Time"
                    delay={500}
                  />

                  <AnimatedStatsCard
                    title="Achievements"
                    value={performance?.achievements?.length || 0}
                    icon={Trophy}
                    color="text-yellow-600"
                    bgColor="bg-yellow-100"
                    trend="up"
                    subtitle="Earned"
                    delay={600}
                  />

                  <AnimatedStatsCard
                    title="Class Rank"
                    value={performance?.class_rank ? `${performance.class_rank}${
                      performance.class_rank === 1 ? 'st' :
                      performance.class_rank === 2 ? 'nd' :
                      performance.class_rank === 3 ? 'rd' : 'th'
                    }` : 'N/A'}
                    icon={Target}
                    color="text-pink-600"
                    bgColor="bg-pink-100"
                    trend="up"
                    subtitle={performance?.total_students_in_class ? `Out of ${performance.total_students_in_class}` : ''}
                    delay={700}
                  />
                </div>

                {/* Achievements Section */}
                {performance?.achievements && performance.achievements.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Recent Achievements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {performance.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3"
                        >
                          <div className="flex-shrink-0">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{achievement}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Feature Grid */}
            <div className="mb-8 sm:mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quick Access Features</h2>
                <p className="text-gray-600">Navigate to different sections of your child's academic portal</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <FeatureBox
                  title="Attendance"
                  icon={Calendar}
                  onClick={() => setActiveTab('attendance')}
                  gradient="from-green-500 to-emerald-600"
                  hoverGradient="from-green-600 to-emerald-700"
                  delay={0}
                />

                <FeatureBox
                  title="Grades"
                  icon={BookOpen}
                  onClick={() => setActiveTab('grades')}
                  gradient="from-blue-500 to-indigo-600"
                  hoverGradient="from-blue-600 to-indigo-700"
                  delay={100}
                />

                <FeatureBox
                  title="Feedback"
                  icon={MessageSquare}
                  onClick={() => setActiveTab('feedback')}
                  gradient="from-orange-500 to-red-600"
                  hoverGradient="from-orange-600 to-red-700"
                  delay={200}
                />

                <FeatureBox
                  title="Schedule"
                  icon={CalendarIcon}
                  onClick={() => setActiveTab('schedule')}
                  gradient="from-purple-500 to-pink-600"
                  hoverGradient="from-purple-600 to-pink-700"
                  delay={300}
                />

                <FeatureBox
                  title="Fees"
                  icon={DollarSign}
                  onClick={() => setActiveTab('fees')}
                  gradient="from-yellow-500 to-orange-600"
                  hoverGradient="from-yellow-600 to-orange-700"
                  delay={400}
                />

                <FeatureBox
                  title="Assignments"
                  icon={FileText}
                  onClick={() => setActiveTab('assignments')}
                  gradient="from-teal-500 to-cyan-600"
                  hoverGradient="from-teal-600 to-cyan-700"
                  delay={500}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Tracking</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => exportToExcel(
                    getFilteredAttendance().map(record => ({
                      Date: record.date,
                      Status: record.status,
                      Student: record.student_name
                    })),
                    'Attendance Report'
                  )}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
            
            {/* Attendance Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start">
                    <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Days</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{attendanceStats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Present</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{attendanceStats.present}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start">
                    <XCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{attendanceStats.absent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start">
                    <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Late</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{attendanceStats.late}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Attendance Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Student</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {getFilteredAttendance().map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{record.date}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{record.student_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Academic Performance</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => exportToExcel(
                    getFilteredGrades().map(grade => ({
                      Subject: grade.subject,
                      Score: `${grade.score}%`,
                      Grade: grade.grade,
                      Date: grade.date
                    })),
                    'Grades Report'
                  )}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
            
            {/* Subject-wise Performance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {gradesBySubject.map((subjectData) => (
                <div key={subjectData.subject} className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{subjectData.subject}</h3>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">{subjectData.average}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {subjectData.grades.slice(0, 3).map((grade) => (
                      <div key={grade.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{grade.date}</span>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 mr-2">{grade.grade}</span>
                          <span className="text-gray-500">({grade.score}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* All Grades Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Grades</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200">
                    {getFilteredGrades().map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{grade.subject}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{grade.score}%</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            grade.score >= 90 ? 'bg-green-100 text-green-800' :
                            grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                            grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {grade.grade}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{grade.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Teacher Feedback</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => exportToExcel(
                    getFilteredFeedback().map(item => ({
                      Subject: item.subject,
                      Message: item.message,
                      Rating: `${item.rating}/5`,
                      Date: item.date
                    })),
                    'Feedback Report'
                  )}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {getFilteredFeedback().map((item) => (
                <div key={item.id} className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.subject}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{item.date}</p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            star <= item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ParentDashboard;