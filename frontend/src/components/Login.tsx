
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
  UserCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Send
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation states
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    countryCode: '+91',
    otp: ['', '', '', '', '', ''],
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Testimonials data
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Principal, Delhi Public School",
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      feedback: "MyUniOne has revolutionized how we manage our school. The seamless integration between teachers, parents, and administration has improved our efficiency by 300%.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Parent, Ryan International",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      feedback: "As a parent, I love how I can track my child's progress in real-time. The communication with teachers has never been easier. Highly recommended!",
      rating: 5
    },
    {
      name: "Ms. Anita Verma",
      role: "Mathematics Teacher, St. Mary's",
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      feedback: "The digital gradebook and assignment management features have saved me hours each week. My students are more engaged than ever!",
      rating: 5
    }
  ];
  
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-play testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
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
      setShowLogin(false);
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
        setShowLogin(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
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
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleLogin = (role: 'parent' | 'teacher' | 'management') => {
    setUserType(role);
    setShowLogin(true);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Show Schools component
  if (showSchools) {
    return <School onBack={() => setShowSchools(false)} />;
  }

  // Login Modal
  const LoginModal = () => {
    if (!showLogin) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modalSlideIn">
          <div className="flex h-full max-h-[80vh]">
            {/* Left Side - Brand (Hidden on small screens) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
                <div className="absolute top-32 right-16 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-20 left-8 w-24 h-24 border border-white/10 rounded-full"></div>
                <div className="absolute bottom-40 right-12 w-12 h-12 border border-white/40 rounded-full"></div>
              </div>
              
              <div className="relative z-10 flex flex-col justify-center p-8 text-white">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">MyUniOne</h1>
                      <p className="text-blue-200 text-sm">Education Excellence</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Welcome to the Future of{' '}
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Education Management
                    </span>
                  </h2>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Join thousands of schools, teachers, and parents in creating exceptional educational experiences.
                  </p>

                  <div className="space-y-3">
                    {['Real-time Progress Tracking', 'Seamless Communication', 'Advanced Analytics'].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-blue-100">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
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

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <button type="button" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        Forgot password?
                      </button>
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
                        'Sign In'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Landing Page
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Navigation */}
      <header className="fixed w-full z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyUniOne
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                ['Home', 'home'],
                ['About', 'about'],
                ['Services', 'services'],
                ['Solutions', 'solutions'],
                ['Contact', 'contact']
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
              ))}
              <button
                onClick={() => setShowSchools(true)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group"
              >
                Schools
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 py-4 animate-slideInDown">
              <div className="flex flex-col space-y-4 px-4">
                {[
                  ['Home', 'home'],
                  ['About', 'about'],
                  ['Services', 'services'],
                  ['Solutions', 'solutions'],
                  ['Contact', 'contact']
                ].map(([label, id]) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setShowSchools(true)}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                >
                  Schools
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-center mt-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fadeInUp border border-blue-200/50">
                <Sparkles className="w-4 h-4" />
                India's #1 Education Platform
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-200">
                Transforming{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Education &amp; Business
                </span>
                <span className="text-gray-700 text-2xl sm:text-3xl md:text-4xl block mt-2">
                  with Innovative Digital Solutions
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed animate-fadeInUp animation-delay-400">
                Empowering schools with comprehensive management solutions that connect educators, students, and parents in one seamless platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fadeInUp animation-delay-600">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Learn More
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-600 animate-fadeInUp animation-delay-800">
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

            {/* Right Side - Illustration */}
            <div className="relative animate-fadeInUp animation-delay-1000">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Student Progress</h3>
                        <p className="text-gray-600 text-sm">Real-time analytics</p>
                      </div>
                    </div>
                    <div className="text-green-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Mathematics</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-12 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Science</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-14 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">English</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-15 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">95%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/50 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">New Message</p>
                      <p className="text-xs text-gray-600">From Math Teacher</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/50 animate-float animation-delay-2000">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Upcoming Test</p>
                      <p className="text-xs text-gray-600">Physics - Tomorrow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MyUniOne</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing education management with innovative digital solutions that create seamless connections between all educational stakeholders.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100/50">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To empower educational institutions with comprehensive digital tools that streamline operations, enhance communication, and create exceptional learning environments.
                </p>
                <div className="space-y-3">
                  {['Seamless school management', 'Enhanced collaboration', 'Student-centric approach'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100/50">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To become the global leader in educational technology by creating innovative solutions that transform learning environments into dynamic ecosystems.
                </p>
                <div className="space-y-3">
                  {['Innovation-driven solutions', 'Global educational impact', 'Future-ready technology'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <Rocket className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your educational institution efficiently and effectively
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardCheck,
                title: "Smart Attendance",
                description: "AI-powered attendance tracking with real-time notifications and automated reporting systems.",
                features: ["QR Code scanning", "Real-time alerts", "Automated reports"],
                color: "from-blue-600 to-cyan-600"
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Comprehensive insights with advanced analytics for data-driven decision making.",
                features: ["Performance metrics", "Predictive analytics", "Custom reports"],
                color: "from-green-600 to-emerald-600"
              },
              {
                icon: MessageCircle,
                title: "Communication Hub",
                description: "Unified messaging platform connecting all educational stakeholders seamlessly.",
                features: ["Instant messaging", "Video calls", "Group discussions"],
                color: "from-purple-600 to-violet-600"
              },
              {
                icon: Calendar,
                title: "Schedule Management",
                description: "Intelligent timetabling with automated conflict resolution and optimization.",
                features: ["Smart scheduling", "Conflict detection", "Resource booking"],
                color: "from-orange-600 to-red-600"
              },
              {
                icon: CreditCard,
                title: "Fee Management",
                description: "Complete financial management with secure payment processing and tracking.",
                features: ["Online payments", "Invoice generation", "Financial reports"],
                color: "from-pink-600 to-rose-600"
              },
              {
                icon: Shield,
                title: "Security & Privacy",
                description: "Enterprise-grade security with advanced encryption and compliance standards.",
                features: ["Data encryption", "Role-based access", "Audit trails"],
                color: "from-indigo-600 to-blue-600"
              }
            ].map((service, index) => (
              <div
                key={index}
                className={`group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 ${
                  isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.solutions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Tailored <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized dashboards designed for each stakeholder in the education ecosystem
            </p>
          </div>

          <div className="space-y-20">
            {[
              {
                role: 'teacher',
                icon: UserCheck,
                title: 'Teacher Dashboard',
                badge: 'For Educators',
                description: 'Comprehensive classroom management tools designed to enhance teaching effectiveness and student engagement.',
                features: [
                  'Interactive gradebook with automated calculations',
                  'Digital lesson planning and curriculum mapping',
                  'Student performance analytics and insights',
                  'Parent communication portal',
                  'Assignment creation and distribution',
                  'Attendance tracking with notifications'
                ],
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50'
              },
              {
                role: 'parent',
                icon: Users,
                title: 'Parent Dashboard',
                badge: 'For Families',
                description: 'Stay connected with your child\'s educational journey through real-time updates and comprehensive insights.',
                features: [
                  'Real-time academic progress tracking',
                  'Attendance monitoring and alerts',
                  'Direct communication with teachers',
                  'Fee payment and financial tracking',
                  'Event calendar and school updates',
                  'Assignment and homework visibility'
                ],
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50'
              },
              {
                role: 'management',
                icon: Shield,
                title: 'Management Dashboard',
                badge: 'For Administrators',
                description: 'Complete institutional oversight with advanced analytics, reporting, and administrative control systems.',
                features: [
                  'School-wide analytics and reporting',
                  'Staff management and scheduling',
                  'Financial oversight and budgeting',
                  'Student enrollment and records',
                  'System administration and settings',
                  'Performance monitoring and insights'
                ],
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50'
              }
            ].map((solution, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
                  isVisible.solutions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                } ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <solution.icon className="w-4 h-4" />
                    {solution.badge}
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    {solution.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="grid gap-4 mb-8">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-6 h-6 bg-gradient-to-r ${solution.color} rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleRoleLogin(solution.role as any)}
                    className={`group bg-gradient-to-r ${solution.color} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="flex items-center gap-2">
                      Access Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className={`bg-gradient-to-br ${solution.bgColor} rounded-3xl p-8 border border-white/50 transform hover:scale-105 transition-transform duration-500`}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center shadow-lg`}>
                            <solution.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{solution.title}</h4>
                            <p className="text-gray-600 text-sm">Dashboard Preview</p>
                          </div>
                        </div>
                        <div className="text-green-600">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">98%</div>
                            <div className="text-xs text-gray-600">Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">24/7</div>
                            <div className="text-xs text-gray-600">Support</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">500+</div>
                            <div className="text-xs text-gray-600">Schools</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden" data-animate id="stats">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "500+", label: "Schools Connected", icon: SchoolIcon },
              { number: "50K+", label: "Active Students", icon: Users },
              { number: "5K+", label: "Dedicated Teachers", icon: UserCheck },
              { number: "99.9%", label: "System Uptime", icon: Shield }
            ].map((stat, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:scale-110 ${
                  isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300 border border-white/30">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-100 group-hover:text-white transition-colors text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden" data-animate id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Community Says</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from educators, parents, and administrators who have transformed their institutions with MyUniOne
            </p>
          </div>

          <div className="relative">
            <div className={`bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="text-blue-600">
                  <Quote className="w-12 h-12" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="flex mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-6 font-medium">
                    "{testimonials[currentTestimonial].feedback}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Join Our Community</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Be part of the education revolution
                      </p>
                      <button
                        onClick={() => setShowLogin(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get In <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your educational institution? Let's discuss how MyUniOne can help you achieve your goals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className={`space-y-6 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Email Us</h4>
                <p className="text-gray-600">support@myunione.edu</p>
                <p className="text-gray-600">sales@myunione.edu</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100/50">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Call Us</h4>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-gray-600">+91 98765 43211</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Visit Us</h4>
                <p className="text-gray-600">Greater Noida</p>
                <p className="text-gray-600">Uttar Pradesh, India</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`lg:col-span-2 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <form onSubmit={handleContactSubmit} className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Or get started immediately with a{' '}
                    <button
                      type="button"
                      onClick={() => setShowLogin(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      free trial
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MyUniOne</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Empowering education through innovative digital solutions that connect schools, teachers, parents, and students worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  ['Home', 'home'],
                  ['About Us', 'about'],
                  ['Services', 'services'],
                  ['Contact', 'contact']
                ].map(([label, id]) => (
                  <li key={id}>
                    <button 
                      onClick={() => scrollToSection(id)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Solutions</h4>
              <ul className="space-y-3">
                {[
                  ['Teacher Dashboard', 'teacher'],
                  ['Parent Dashboard', 'parent'],
                  ['Admin Dashboard', 'management'],
                  ['School Directory', 'schools']
                ].map(([label, action]) => (
                  <li key={action}>
                    <button
                      onClick={() => action === 'schools' ? setShowSchools(true) : handleRoleLogin(action as any)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>Greater Noida, UP, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>support@myunione.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 MyUniOne Ltd. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <button
                  onClick={scrollToTop}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-300 group"
                >
                  <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-slideInDown { animation: slideInDown 0.4s ease-out; }
        .animate-modalSlideIn { animation: modalSlideIn 0.3s ease-out; }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Login;
