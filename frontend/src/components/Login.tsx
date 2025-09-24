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
  MapPin,
  Send,
  Monitor,
  Smartphone,
  TabletSmartphone,
  Code,
  Palette,
  Settings,
  Database,
  Lock,
  Wifi,
  HeadphonesIcon,
  Briefcase
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

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    countryCode: '+91',
    otp: ['', '', '', '', '', ''],
  });

  // Hero animated words
  const heroWords = ['Transform', 'Empower', 'Elevate'];
  
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

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the contact form data to your API
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleLogin = (role: 'parent' | 'teacher' | 'management') => {
    setUserType(role);
    setShowLogin(true);
  };

  // Show Schools component
  if (showSchools) {
    return <School onBack={() => setShowSchools(false)} />;
  }

  // Main Landing Page
  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-white">
        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center group cursor-pointer" onClick={() => scrollToSection('home')}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MyUniOne
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Services
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Solutions
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('products')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => setShowSchools(true)} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Schools
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group px-2 py-1"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

            {/* Mobile Navigation Slide-out */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg">
                <div className="flex flex-col px-6 py-4 space-y-4">
                  <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Home</button>
                  <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">About Us</button>
                  <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Services</button>
                  <button onClick={() => scrollToSection('solutions')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Solutions</button>
                  <button onClick={() => scrollToSection('products')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Products</button>
                  <button onClick={() => setShowSchools(true)} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Schools</button>
                  <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Contact</button>
                  <button 
                    onClick={() => setShowLogin(true)} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-center shadow-lg mt-2"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
            
            {/* Geometric Patterns */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-blue-200/30 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 border border-indigo-200/30 rounded-lg rotate-45 animate-pulse"></div>
            <div className="absolute top-40 left-32 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl animate-bounce-slow"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fadeIn border border-blue-200/50 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Trusted by 500+ Educational Institutions
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              {/* Main Heading with Animation */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="block mb-2">
                  {animatedText.split(' ').map((word, index) => (
                    <span
                      key={index}
                      className={`inline-block mr-3 ${index < currentWordIndex ? 'animate-slideInUp' : 'opacity-0'} ${
                        word === 'Transform' ? 'text-blue-600' : 
                        word === 'Empower' ? 'text-indigo-600' : 
                        word === 'Elevate' ? 'text-purple-600' : ''
                      }`}
                      style={{ animationDelay: `${index * 600}ms` }}
                    >
                      {word}
                    </span>
                  ))}
                </span>
                {currentWordIndex >= heroWords.length && (
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block animate-slideInUp animation-delay-2000">
                    Education Excellence
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed animate-fadeInUp animation-delay-2500 max-w-4xl mx-auto">
                Comprehensive digital solutions that revolutionize school management, enhance learning experiences, and create stronger connections between educators, students, and families.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fadeInUp animation-delay-3000">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 group"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Learn More
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp animation-delay-3500">
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Secure Platform</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">Award</div>
                  <div className="text-sm text-gray-600">Winning</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button 
              onClick={() => scrollToSection('about')}
              className="w-8 h-12 border-2 border-gray-300 rounded-full flex justify-center hover:border-blue-600 transition-colors group"
            >
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 group-hover:bg-blue-600 transition-colors"></div>
            </button>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-white relative overflow-hidden" data-animate>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.about ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building className="w-4 h-4" />
                About MyUniOne
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Revolutionizing <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Education Technology</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're not just building software; we're crafting the future of education. Our comprehensive digital ecosystem connects every stakeholder in the educational journey, creating seamless experiences that drive real results.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              {/* Left side - Content */}
              <div className={`transition-all duration-1000 ${isVisible.about ? 'animate-slideInLeft' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Empowering Education Through 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Innovation</span>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  At MyUniOne, we believe that every student deserves access to exceptional educational experiences. Our platform bridges the gap between traditional teaching methods and modern digital solutions, creating an environment where learning thrives and potential is unleashed.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Mission-Driven Approach</h4>
                      <p className="text-gray-600">Transforming education through innovative technology solutions that enhance learning outcomes and operational efficiency.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Ecosystem</h4>
                      <p className="text-gray-600">Creating stronger connections between teachers, students, and families through seamless communication and engagement tools.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h4>
                      <p className="text-gray-600">Leveraging advanced analytics to provide actionable insights that drive informed decision-making and improved outcomes.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => scrollToSection('services')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <span className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

              {/* Right side - Illustration/Image placeholder */}
              <div className={`transition-all duration-1000 ${isVisible.about ? 'animate-slideInRight' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  {/* Main card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                          <SchoolIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
                        <div className="text-sm text-gray-600">Schools Connected</div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
                        <div className="text-sm text-gray-600">Active Students</div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">5K+</div>
                        <div className="text-sm text-gray-600">Educators</div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
                        <div className="text-sm text-gray-600">Satisfaction</div>
                      </div>
                    </div>
                    
                    {/* Central element */}
                    <div className="mt-8 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Heart className="w-10 h-10 text-white animate-pulse" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900">Loved by Education Community</div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce-slow shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Cards */}
            <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${isVisible.about ? 'animate-fadeInUp animation-delay-500' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To become the global standard in educational technology, empowering institutions worldwide to deliver exceptional learning experiences through innovative digital solutions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Global educational transformation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Innovation-driven solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Accessible quality education</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To revolutionize education by providing comprehensive, user-friendly digital tools that enhance teaching effectiveness, improve student outcomes, and strengthen school communities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Enhanced teaching effectiveness</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Improved student outcomes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Stronger communities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50 relative overflow-hidden" data-animate>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.services ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Settings className="w-4 h-4" />
                Our Services
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Comprehensive <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Educational Solutions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                From school management to student engagement, our comprehensive suite of services covers every aspect of modern education technology
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: ClipboardCheck,
                  title: "Smart Attendance Management",
                  description: "Automated attendance tracking with real-time notifications, QR code scanning, and comprehensive reporting for better accountability.",
                  features: ["QR Code Integration", "Real-time Alerts", "Automated Reports", "Mobile App Support"],
                  color: "from-blue-600 to-cyan-600",
                  bgColor: "from-blue-50 to-cyan-50"
                },
                {
                  icon: BarChart3,
                  title: "Advanced Grade Management",
                  description: "Comprehensive grading system with analytics, progress tracking, and detailed performance reports for informed decision-making.",
                  features: ["Digital Gradebook", "Progress Analytics", "Performance Reports", "Grade Predictions"],
                  color: "from-green-600 to-emerald-600",
                  bgColor: "from-green-50 to-emerald-50"
                },
                {
                  icon: MessageCircle,
                  title: "Communication Hub",
                  description: "Seamless messaging platform connecting teachers, parents, and students with real-time updates and collaborative tools.",
                  features: ["Real-time Messaging", "Group Communications", "File Sharing", "Translation Support"],
                  color: "from-purple-600 to-violet-600",
                  bgColor: "from-purple-50 to-violet-50"
                },
                {
                  icon: Calendar,
                  title: "Schedule & Event Management",
                  description: "Interactive calendar system for managing classes, events, assignments, and important dates with automated reminders.",
                  features: ["Interactive Calendar", "Event Scheduling", "Assignment Tracking", "Smart Reminders"],
                  color: "from-orange-600 to-red-600",
                  bgColor: "from-orange-50 to-red-50"
                },
                {
                  icon: CreditCard,
                  title: "Digital Fee Management",
                  description: "Complete fee collection system with online payments, automated receipts, and detailed financial tracking and reporting.",
                  features: ["Online Payments", "Receipt Generation", "Financial Reports", "Payment Reminders"],
                  color: "from-pink-600 to-rose-600",
                  bgColor: "from-pink-50 to-rose-50"
                },
                {
                  icon: Shield,
                  title: "Security & Compliance",
                  description: "Enterprise-grade security with data encryption, role-based access control, and compliance with educational standards.",
                  features: ["Data Encryption", "Role Management", "Audit Logs", "Compliance Tools"],
                  color: "from-indigo-600 to-blue-600",
                  bgColor: "from-indigo-50 to-blue-50"
                }
              ].map((service, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group border border-gray-100 overflow-hidden ${
                    isVisible.services ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Card Header with Gradient Background */}
                  <div className={`bg-gradient-to-r ${service.bgColor} p-8 border-b border-gray-100`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 bg-white relative overflow-hidden" data-animate>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.solutions ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Lightbulb className="w-4 h-4" />
                Smart Solutions
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Innovative <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Educational Solutions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover how our cutting-edge solutions transform traditional educational processes into seamless digital experiences
              </p>
            </div>

            {/* Alternating Layout Solutions */}
            <div className="space-y-20">
              {/* Solution 1 - Image Left, Text Right */}
              <div className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible.solutions ? 'animate-slideInLeft' : 'opacity-0 -translate-x-10'}`}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-md">
                        <Monitor className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Web Dashboard</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md">
                        <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Mobile App</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md">
                        <TabletSmartphone className="w-8 h-8 text-purple-600 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Tablet Optimized</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md">
                        <Wifi className="w-8 h-8 text-orange-600 mb-2" />
                        <div className="text-sm font-medium text-gray-700">Cloud Sync</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-green-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Multi-Platform <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Accessibility</span>
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Access your educational ecosystem from anywhere, on any device. Our responsive design ensures seamless functionality across web browsers, mobile devices, and tablets, providing consistent user experiences for all stakeholders.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Cross-platform compatibility</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Real-time synchronization</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Offline functionality</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg group"
                  >
                    <span className="flex items-center gap-2">
                      Explore Platform
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Solution 2 - Text Left, Image Right */}
              <div className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible.solutions ? 'animate-slideInRight' : 'opacity-0 translate-x-10'}`}>
                <div className="order-2 lg:order-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Advanced <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Analytics & Insights</span>
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Make data-driven decisions with our comprehensive analytics dashboard. Track student performance, monitor engagement levels, and identify trends to optimize educational outcomes and institutional effectiveness.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Performance tracking</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Detailed reporting</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Predictive insights</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 lg:order-2 relative">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-xl">
                    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Performance Overview</h4>
                        <div className="text-sm text-gray-500">This Month</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Student Engagement</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-green-200 rounded-full">
                              <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">85%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Assignment Completion</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-blue-200 rounded-full">
                              <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-blue-600">92%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Attendance Rate</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-purple-200 rounded-full">
                              <div className="w-19 h-2 bg-purple-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-purple-600">96%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 text-center shadow-md">
                        <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
                        <div className="text-xs text-gray-600">Satisfaction</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center shadow-md">
                        <div className="text-2xl font-bold text-blue-600 mb-1">4.9</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center shadow-md">
                        <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                        <div className="text-xs text-gray-600">Support</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden" data-animate>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.products ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Our Products
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Complete <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Product Suite</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover our comprehensive range of educational products designed to meet every need of modern educational institutions
              </p>
            </div>

            {/* Dashboard Access Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  role: 'teacher',
                  icon: UserCheck,
                  title: 'Teacher Dashboard',
                  description: 'Comprehensive classroom management tools with grade tracking, attendance monitoring, and seamless parent communication.',
                  features: ['Class Management', 'Grade Book', 'Attendance Tracking', 'Parent Communication', 'Assignment Creation', 'Performance Analytics'],
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-50 to-emerald-50',
                  borderColor: 'border-green-200'
                },
                {
                  role: 'parent',
                  icon: Users,
                  title: 'Parent Portal',
                  description: 'Stay connected with your child\'s educational journey through real-time updates and comprehensive progress tracking.',
                  features: ['Child\'s Progress', 'Attendance Records', 'Fee Payment', 'Teacher Communication', 'Event Updates', 'Report Cards'],
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-50 to-cyan-50',
                  borderColor: 'border-blue-200'
                },
                {
                  role: 'management',
                  icon: Shield,
                  title: 'Admin Console',
                  description: 'Complete school administration with advanced analytics, staff management, and comprehensive system oversight.',
                  features: ['School Analytics', 'Staff Management', 'Financial Reports', 'System Administration', 'User Management', 'Data Insights'],
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-50 to-pink-50',
                  borderColor: 'border-purple-200'
                }
              ].map((product, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group border-2 ${product.borderColor} overflow-hidden ${
                    isVisible.products ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Product Header */}
                  <div className={`bg-gradient-to-r ${product.bgColor} p-8 border-b border-gray-100`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                  
                  {/* Product Features */}
                  <div className="p-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                    <div className="space-y-3 mb-8">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleRoleLogin(product.role as any)}
                        className={`w-full bg-gradient-to-r ${product.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                      >
                        Access Dashboard
                      </button>
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                      >
                        Request Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Products */}
            <div className={`transition-all duration-1000 ${isVisible.products ? 'animate-fadeInUp animation-delay-500' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Extended <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Product Ecosystem</span>
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Smartphone,
                    title: "Mobile Apps",
                    description: "Native iOS and Android apps for on-the-go access",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Database,
                    title: "Data Analytics",
                    description: "Advanced reporting and business intelligence tools",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Lock,
                    title: "Security Suite",
                    description: "Enterprise-grade security and compliance tools",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    icon: HeadphonesIcon,
                    title: "24/7 Support",
                    description: "Round-the-clock technical support and training",
                    color: "from-purple-500 to-indigo-500"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group text-center border border-gray-100"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden" data-animate id="stats">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.stats ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Join the growing community of educational institutions that have transformed their operations with MyUniOne
              </p>
            </div>
            
            <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center transition-all duration-1000 ${isVisible.stats ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              {[
                { number: "500+", label: "Schools Connected", icon: SchoolIcon, description: "Educational institutions worldwide" },
                { number: "50K+", label: "Active Students", icon: Users, description: "Students using our platform daily" },
                { number: "5K+", label: "Teachers", icon: UserCheck, description: "Educators enhancing their teaching" },
                { number: "99.9%", label: "Uptime", icon: Shield, description: "Reliable service guarantee" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-500 hover:scale-110 ${
                    isVisible.stats ? 'animate-slideUp' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-blue-100 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-blue-200">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50" data-animate>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.contact ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MessageCircle className="w-4 h-4" />
                Get In Touch
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">School?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Contact us today to schedule a personalized demo and discover how MyUniOne can revolutionize your educational institution
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className={`transition-all duration-1000 ${isVisible.contact ? 'animate-slideInLeft' : 'opacity-0 -translate-x-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                        <p className="text-gray-600">team@myunione.in</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                        <p className="text-gray-600">+91 70115 65759</p>
                        <p className="text-gray-600">+91 97172 70897</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
                        <p className="text-gray-600">Greater Noida</p>
                        <p className="text-gray-600">Uttar Pradesh, India</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Business Hours</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sunday</span>
                        <span className="font-medium text-red-600">Closed</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowLogin(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Start Free Trial
                      </button>
                      <button 
                        onClick={() => setShowSchools(true)}
                        className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                      >
                        Browse Schools
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className={`transition-all duration-1000 ${isVisible.contact ? 'animate-slideInRight' : 'opacity-0 translate-x-10'}`}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">Send Us a Message</h3>
                    <p className="text-blue-100 leading-relaxed">
                      Ready to get started? Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-blue-100 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-blue-100 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-blue-100 mb-2">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm resize-none"
                        placeholder="Tell us about your requirements..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </span>
                    </button>

                    <div className="text-center pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>Free Consultation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>Quick Response</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">MyUniOne</span>
                    <p className="text-gray-400 text-sm">Education Management Platform</p>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  Empowering educational institutions with comprehensive digital solutions that transform learning experiences and create stronger connections between educators, students, and families.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <span className="text-white text-sm font-bold">f</span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <span className="text-white text-sm font-bold">t</span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <span className="text-white text-sm font-bold">in</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">Home</button></li>
                  <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                  <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">Services</button></li>
                  <li><button onClick={() => scrollToSection('solutions')} className="text-gray-400 hover:text-white transition-colors">Solutions</button></li>
                  <li><button onClick={() => scrollToSection('products')} className="text-gray-400 hover:text-white transition-colors">Products</button></li>
                  <li><button onClick={() => setShowSchools(true)} className="text-gray-400 hover:text-white transition-colors">Schools</button></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
                <ul className="space-y-3">
                  <li><span className="text-gray-400">Attendance Management</span></li>
                  <li><span className="text-gray-400">Grade Management</span></li>
                  <li><span className="text-gray-400">Communication Hub</span></li>
                  <li><span className="text-gray-400">Fee Management</span></li>
                  <li><span className="text-gray-400">Analytics & Reports</span></li>
                  <li><span className="text-gray-400">24/7 Support</span></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 sm:mb-0">
                  &copy; 2025 MyUniOne Ltd. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
                  <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
                  <span className="cursor-pointer hover:text-white transition-colors">Cookie Policy</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 group"
        >
          <ArrowUp className="w-6 h-6 mx-auto group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
                  <p className="text-sm text-gray-600">Sign in to your account</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
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
        </div>
      )}
    </>
  );
};

export default Login;
