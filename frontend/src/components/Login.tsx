import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';
import School from './School';
import { 
  GraduationCap, 
  User, 
  Users, 
  BookOpen, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff,
  Calendar,
  ClipboardCheck,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Award,
  MessageCircle,
  CreditCard,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  School as SchoolIcon,
  Sparkles,
  Zap,
  Target,
  ChevronDown,
  Play,
  Building,
  Globe,
  Lightbulb,
  Rocket,
  Heart,
  Check,
  ArrowUp,
  FileText,
  PieChart,
  Megaphone,
  UserCheck
} from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [userType, setUserType] = useState<'parent' | 'teacher' | 'management'>('parent');
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation states
  const [animatedText, setAnimatedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    countryCode: '+91',
    otp: ['', '', '', '', '', ''],
  });

  // Hero animated words
  const heroWords = ['Empowering', 'Education', 'Excellence'];
  
  useEffect(() => {
    if (!showLogin && !showSchools) {
      const timer = setTimeout(() => {
        if (currentWordIndex < heroWords.length) {
          setAnimatedText(prev => prev + (prev ? ' ' : '') + heroWords[currentWordIndex]);
          setCurrentWordIndex(prev => prev + 1);
        }
      }, currentWordIndex === 0 ? 800 : 600);

      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, showLogin, showSchools]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [showLogin, showSchools]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({ ...prev, otp: newOtp }));

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: userType,
      });

      login(response.data.token, response.data.user);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isOtpSent) {
        const response = await authAPI.mobileLogin({
          phone: formData.countryCode + formData.phone,
          role: userType,
        });

        setIsOtpSent(true);
        toast.success('OTP sent successfully! Use: 123456');
        startOtpTimer();
      } else {
        const otpValue = formData.otp.join('');
        const response = await authAPI.verifyOTP({
          phone: formData.countryCode + formData.phone,
          otp: otpValue,
          role: userType,
        });

        login(response.data.token, response.data.user);
        toast.success('Login successful!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(30);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOtp = async () => {
    try {
      await authAPI.mobileLogin({
        phone: formData.countryCode + formData.phone,
        role: userType,
      });
      toast.success('OTP resent successfully!');
      startOtpTimer();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleRoleLogin = (role: 'parent' | 'teacher' | 'management') => {
    setUserType(role);
    setShowLogin(true);
  };

  // Show Schools component
  if (showSchools) {
    return <School onBack={() => setShowSchools(false)} />;
  }

  // Login Page/Modal with Two-Column Layout
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyUniOne
              </span>
            </div>
            <button
              onClick={() => setShowLogin(false)}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Layout Container */}
        <div className="w-full flex lg:min-h-screen">
          
          {/* Left Side - Brand/Illustration (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-40 right-32 w-24 h-24 border border-white/15 rounded-full"></div>
                <div className="absolute bottom-32 left-16 w-40 h-40 border border-white/10 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-20 h-20 border border-white/25 rounded-full"></div>
              </div>
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">MyUniOne</h1>
                    <p className="text-blue-200 text-sm">Education Management Platform</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                    Welcome to the Future of 
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Education Management
                    </span>
                  </h2>
                  <p className="text-lg text-blue-100 leading-relaxed">
                    Connect seamlessly with teachers, track academic progress, and stay engaged 
                    in your educational journey with our comprehensive platform.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-100">Real-time academic tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-100">Seamless parent-teacher communication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-100">Comprehensive performance analytics</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-blue-200">Schools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">50K+</div>
                    <div className="text-sm text-blue-200">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-blue-200">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Back to Home (Desktop) */}
              <div className="mt-auto pt-8">
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-blue-200 hover:text-white flex items-center gap-2 font-medium group transition-all duration-300"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex-1 lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 pt-20 lg:pt-4">
            <div className="w-full max-w-md">
              
              {/* Login Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slideInUp">
                
                {/* Card Header */}
                <div className="p-8 text-center border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                  <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>

                {/* Card Body */}
                <div className="p-8 space-y-6">
                  
                  {/* Role Selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Select Your Role</label>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl">
                      {[
                        { value: 'parent', icon: Users, label: 'Parent' },
                        { value: 'teacher', icon: User, label: 'Teacher' },
                        { value: 'management', icon: Shield, label: 'Admin' }
                      ].map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setUserType(role.value as any)}
                          className={`group flex flex-col items-center gap-2 py-3 px-2 rounded-lg transition-all duration-300 ${
                            userType === role.value
                              ? 'bg-white text-blue-600 shadow-md scale-105 ring-2 ring-blue-100'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                          }`}
                        >
                          <role.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                          <span className="text-xs font-medium">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Login Method Toggle */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Choose Login Method</label>
                    <div className="flex bg-gray-50 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod('mobile');
                          setIsOtpSent(false);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                          loginMethod === 'mobile'
                            ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-100'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">Mobile OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                          loginMethod === 'email'
                            ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-100'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Login Forms */}
                  {loginMethod === 'mobile' ? (
                    <form onSubmit={handleMobileLogin} className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Mobile Number
                        </label>
                        <div className="flex rounded-lg shadow-sm ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleInputChange}
                            className="rounded-l-lg border-0 bg-transparent px-3 py-3 text-gray-900 focus:ring-0 sm:text-sm"
                          >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter mobile number"
                            className="block w-full rounded-r-lg border-0 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      {isOtpSent && (
                        <div className="space-y-4 animate-fadeIn">
                          <label className="block text-sm font-medium text-gray-700">
                            Enter Verification Code
                          </label>
                          <div className="flex gap-3 justify-center">
                            {formData.otp.map((digit, index) => (
                              <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-semibold text-lg transition-all duration-200"
                                maxLength={1}
                                required
                              />
                            ))}
                          </div>
                          <div className="text-center">
                            {otpTimer > 0 ? (
                              <p className="text-gray-600 text-sm">Resend code in {otpTimer}s</p>
                            ) : (
                              <button
                                type="button"
                                onClick={resendOtp}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                              >
                                Resend Code
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            {isOtpSent ? 'Verifying...' : 'Sending...'}
                          </div>
                        ) : (
                          isOtpSent ? 'Verify Code' : 'Send Verification Code'
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                          />
                          <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                          Forgot password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Footer */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Secured by MyUniOne • Your data is protected
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Back Button */}
              <div className="lg:hidden mt-6 text-center">
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2 font-medium group transition-all duration-300 mx-auto"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Landing Page
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyUniOne
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('about')} className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('features')} className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('dashboards')} className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
                Dashboards
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('contact')} className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
              onClick={() => setShowSchools(true)} 
              className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Schools
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>

              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</button>
                <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</button>
                <button onClick={() => scrollToSection('features')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</button>
                <button onClick={() => scrollToSection('dashboards')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors">Dashboards</button>
                <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</button>
                <button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-center">Login</button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              India's Leading EdTech Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">
                {animatedText.split(' ').map((word, index) => (
                  <span
                    key={index}
                    className={`inline-block mr-2 ${index < currentWordIndex ? 'animate-slideInUp' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 600}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              {currentWordIndex >= heroWords.length && (
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block animate-slideInUp animation-delay-2000">
                  Through Innovation
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed animate-fadeInUp animation-delay-2500">
              Transforming schools with comprehensive digital solutions that connect teachers, parents, and students for exceptional educational outcomes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp animation-delay-3000">
              <button 
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Explore Platform
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 animate-fadeInUp animation-delay-3500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MyUniOne</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing education management with innovative digital solutions that create seamless connections between all stakeholders.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Mission */}
            <div className={`transition-all duration-1000 ${isVisible.about ? 'animate-slideInLeft' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To empower educational institutions with comprehensive digital tools that streamline operations, enhance communication, and create exceptional learning environments where every student can thrive.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Seamless school management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Enhanced parent-teacher collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Student-centric approach</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className={`transition-all duration-1000 ${isVisible.about ? 'animate-slideInRight' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To become the global leader in educational technology by creating innovative solutions that transform traditional learning environments into dynamic, connected ecosystems.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Innovation-driven solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Global educational impact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Student success focus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className={`transition-all duration-1000 ${isVisible.about ? 'animate-fadeInUp animation-delay-500' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Schools Choose MyUniOne</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level security with end-to-end encryption and compliance standards",
                  color: "from-blue-600 to-cyan-600"
                },
                {
                  icon: Users,
                  title: "Seamless Collaboration",
                  description: "Unified platform connecting teachers, parents, and students effectively",
                  color: "from-green-600 to-emerald-600"
                },
                {
                  icon: TrendingUp,
                  title: "Data-Driven Insights",
                  description: "Advanced analytics and reporting for informed decision making",
                  color: "from-purple-600 to-violet-600"
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  description: "Round-the-clock technical support and training assistance",
                  color: "from-orange-600 to-red-600"
                }
              ].map((highlight, index) => (
                <div
                  key={index}
                  className="group text-center hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.features ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your educational institution efficiently and effectively
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardCheck,
                title: "Smart Attendance",
                description: "Digital attendance tracking with real-time notifications and automated reports",
                features: ["QR Code scanning", "Automated reports", "Parent notifications"],
                color: "from-blue-600 to-cyan-600"
              },
              {
                icon: BarChart3,
                title: "Grade Management",
                description: "Comprehensive grading system with analytics and progress tracking",
                features: ["Digital gradebook", "Performance analytics", "Progress reports"],
                color: "from-green-600 to-emerald-600"
              },
              {
                icon: MessageCircle,
                title: "Communication Hub",
                description: "Seamless messaging between teachers, parents, and students",
                features: ["Real-time messaging", "Group chats", "File sharing"],
                color: "from-purple-600 to-violet-600"
              },
              {
                icon: Calendar,
                title: "Schedule Management",
                description: "Interactive calendar with assignments, events, and reminders",
                features: ["Class timetables", "Event calendar", "Assignment tracking"],
                color: "from-orange-600 to-red-600"
              },
              {
                icon: CreditCard,
                title: "Fee Management",
                description: "Complete fee collection system with online payments",
                features: ["Online payments", "Fee tracking", "Receipt generation"],
                color: "from-pink-600 to-rose-600"
              },
              {
                icon: FileText,
                title: "Assignment Portal",
                description: "Create, distribute, and grade assignments digitally",
                features: ["Digital submissions", "Auto-grading", "Plagiarism check"],
                color: "from-indigo-600 to-blue-600"
              },
              {
                icon: PieChart,
                title: "Analytics Dashboard",
                description: "Comprehensive insights and performance analytics",
                features: ["Student analytics", "Class performance", "Trend analysis"],
                color: "from-teal-600 to-cyan-600"
              },
              {
                icon: Megaphone,
                title: "Announcements",
                description: "Broadcast important updates and news instantly",
                features: ["School-wide alerts", "Targeted messaging", "Read receipts"],
                color: "from-yellow-600 to-orange-600"
              },
              {
                icon: Shield,
                title: "Security & Privacy",
                description: "Enterprise-grade security with role-based access control",
                features: ["Data encryption", "Role management", "Audit logs"],
                color: "from-gray-600 to-slate-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 ${
                  isVisible.features ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Access Section */}
      <section id="dashboards" className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.dashboards ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Access Your Dashboard
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Choose your role to access the personalized dashboard designed for your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: 'teacher',
                icon: UserCheck,
                title: 'Teacher Dashboard',
                description: 'Comprehensive tools for managing classes, assignments, grades, and student communication',
                features: ['Class Management', 'Grade Book', 'Attendance Tracking', 'Parent Communication'],
                color: 'from-green-500 to-emerald-500'
              },
              {
                role: 'parent',
                icon: Users,
                title: 'Parent Dashboard',
                description: 'Stay connected with your child\'s educational journey and school activities',
                features: ['Child\'s Progress', 'Attendance Records', 'Fee Payment', 'Teacher Communication'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                role: 'management',
                icon: Shield,
                title: 'Management Dashboard',
                description: 'Complete school administration with analytics, reporting, and oversight tools',
                features: ['School Analytics', 'Staff Management', 'Financial Reports', 'System Administration'],
                color: 'from-purple-500 to-pink-500'
              }
            ].map((dashboard, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 group ${
                  isVisible.dashboards ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${dashboard.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <dashboard.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{dashboard.title}</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">{dashboard.description}</p>
                
                <ul className="space-y-2 mb-8">
                  {dashboard.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-blue-100">
                      <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleRoleLogin(dashboard.role as any)}
                  className={`w-full bg-gradient-to-r ${dashboard.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:from-white group-hover:to-white group-hover:text-gray-900`}
                >
                  Login as {dashboard.title.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white" data-animate id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center transition-all duration-1000 ${isVisible.stats ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "500+", label: "Schools Connected", icon: SchoolIcon },
              { number: "50K+", label: "Active Students", icon: Users },
              { number: "5K+", label: "Teachers", icon: UserCheck },
              { number: "99.9%", label: "Uptime", icon: Shield }
            ].map((stat, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:scale-110 ${
                  isVisible.stats ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.contact ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get In <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your school's digital experience? Contact us today for a personalized demo
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className={`transition-all duration-1000 ${isVisible.contact ? 'animate-slideInLeft' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600">support@myunione.edu</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visit Us</h4>
                      <p className="text-gray-600">Greater Noida, Uttar Pradesh, India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Business Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className={`transition-all duration-1000 ${isVisible.contact ? 'animate-slideInRight' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Join thousands of schools already using MyUniOne to transform their educational experience.
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowLogin(true)}
                      className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    >
                      Start Free Trial
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('features')}
                      className="w-full border-2 border-white/30 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      Learn More
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/20">
                    <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>No Setup Fees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MyUniOne</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering education through innovative digital solutions that connect schools, teachers, parents, and students.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => setShowLogin(true)} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Dashboards</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleRoleLogin('teacher')} className="text-gray-400 hover:text-white transition-colors">Teacher Dashboard</button></li>
                <li><button onClick={() => handleRoleLogin('parent')} className="text-gray-400 hover:text-white transition-colors">Parent Dashboard</button></li>
                <li><button onClick={() => handleRoleLogin('management')} className="text-gray-400 hover:text-white transition-colors">Management Dashboard</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>Greater Noida, India</p>
                <p>support@myunione.edu</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 MyUniOne Ltd. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-gray-400 text-sm">Powered by MyUniOne</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
