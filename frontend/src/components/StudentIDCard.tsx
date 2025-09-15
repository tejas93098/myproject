import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Mail, Shield, School, QrCode, Star, Award } from 'lucide-react';

interface StudentIDData {
  id: number;
  name: string;
  grade: string;
  email: string;
  studentId: string;
  photoUrl?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  dateOfBirth?: string;
  rollNumber?: string;
  section?: string;
  academicYear?: string;
  parentName?: string;
  admissionDate?: string;
  house?: string;
  achievements?: string[];
}

interface StudentIDCardProps {
  student: StudentIDData;
  schoolInfo?: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    website: string;
    principalName: string;
  };
}

const StudentIDCard: React.FC<StudentIDCardProps> = ({ 
  student, 
  schoolInfo = {
    name: "MY UNIONE SCHOOL",
    logo: "🏫",
    address: "Greater Noida, India",
    phone: "+91 98765 43210",
    website: "www.myunione.edu",
    principalName: "Dr. Sarah Johnson"
  }
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Generate QR Code placeholder
  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Student-ID-${student.studentId}-${student.name}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="student-id-card-container perspective-1000 w-full max-w-sm mx-auto">
      <div
        className={`relative w-full h-[400px] preserve-3d transition-all duration-700 ease-in-out cursor-pointer
          ${isFlipped ? 'rotate-y-180' : ''} 
          ${isHovered ? 'hover-lift' : ''}
        `}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden rounded-2xl shadow-2xl 
          bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 
          border-4 border-white transform-gpu
          ${isHovered ? 'shadow-blue-500/50' : ''}
        `}>
          {/* Security Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 px-6 py-4 bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{schoolInfo.logo}</div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">{schoolInfo.name}</h3>
                  <p className="text-blue-100 text-xs">STUDENT IDENTITY CARD</p>
                </div>
              </div>
              <div className="text-white text-xs text-right">
                <p>ID: {student.studentId}</p>
                <p className="text-blue-100">2024-25</p>
              </div>
            </div>
          </div>

          {/* Student Photo & Info */}
          <div className="relative z-10 px-6 py-4">
            <div className="flex items-start space-x-4">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 
                  flex items-center justify-center overflow-hidden shadow-lg">
                  {student.photoUrl ? (
                    <img 
                      src={student.photoUrl} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white/80" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white
                  animate-pulse shadow-lg"></div>
              </div>

              {/* Student Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                  {student.name}
                </h2>
                <div className="space-y-1">
                  <p className="text-blue-100 text-sm flex items-center">
                    <School className="w-3 h-3 mr-1" />
                    {student.grade} {student.section && `- ${student.section}`}
                  </p>
                  <p className="text-blue-100 text-sm flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Roll: {student.rollNumber || 'N/A'}
                  </p>
                  {student.house && (
                    <p className="text-blue-100 text-sm flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {student.house} House
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="relative z-10 px-6 py-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-xs">Blood Group:</span>
                <span className="text-white text-sm font-semibold">
                  {student.bloodGroup || 'O+'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-xs">DOB:</span>
                <span className="text-white text-sm">
                  {formatDate(student.dateOfBirth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-xs">Emergency:</span>
                <span className="text-white text-sm">
                  {student.emergencyContact || student.parentName || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-3">
            <div className="flex justify-between items-end">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-blue-200" />
                <img 
                  src={generateQRCode()} 
                  alt="QR Code"
                  className="w-8 h-8 rounded border border-white/30"
                />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs">Valid Until: Dec 2025</p>
                <p className="text-white text-xs font-medium">Authorized ID</p>
              </div>
            </div>
          </div>

          {/* Holographic Strip */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-300 via-pink-300 to-purple-300 
            opacity-60 holographic-shine"></div>
        </div>

        {/* Back Side */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-2xl 
          bg-gradient-to-br from-indigo-800 via-purple-700 to-blue-600 
          border-4 border-white transform-gpu
        `}>
          {/* Security Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-pattern-hexagon"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 px-6 py-4 bg-white/10 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-white font-bold text-sm">IMPORTANT INFORMATION</h3>
              <div className="w-16 h-0.5 bg-white/50 mx-auto mt-1"></div>
            </div>
          </div>

          {/* Back Content */}
          <div className="relative z-10 px-6 py-4 space-y-4">
            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                Contact Details
              </h4>
              <div className="space-y-1 text-xs">
                <p className="text-blue-100">
                  <Mail className="w-3 h-3 inline mr-1" />
                  {student.email}
                </p>
                <p className="text-blue-100">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {student.address || 'Address on file'}
                </p>
              </div>
            </div>

            {/* School Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="text-white font-semibold text-sm mb-2 flex items-center">
                <School className="w-3 h-3 mr-1" />
                School Information
              </h4>
              <div className="space-y-1 text-xs text-blue-100">
                <p>{schoolInfo.address}</p>
                <p>{schoolInfo.phone}</p>
                <p>{schoolInfo.website}</p>
              </div>
            </div>

            {/* Achievements */}
            {student.achievements && student.achievements.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-white font-semibold text-sm mb-2 flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Achievements
                </h4>
                <div className="space-y-1">
                  {student.achievements.slice(0, 3).map((achievement, index) => (
                    <p key={index} className="text-blue-100 text-xs">• {achievement}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Instructions */}
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
              <h4 className="text-red-100 font-semibold text-sm mb-2 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Emergency Protocol
              </h4>
              <p className="text-red-100 text-xs leading-relaxed">
                In case of emergency, contact school immediately. This card must be returned if found.
              </p>
            </div>
          </div>

          {/* Signature Area */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-3">
            <div className="flex justify-between items-end">
              <div>
                <div className="w-16 h-8 bg-white/20 rounded border border-white/30 mb-1"></div>
                <p className="text-blue-200 text-xs">Student Sign</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-8 bg-white/20 rounded border border-white/30 mb-1"></div>
                <p className="text-blue-200 text-xs">Principal</p>
              </div>
            </div>
            
            <div className="text-center mt-2">
              <p className="text-blue-200 text-xs">
                Issued: {formatDate(student.admissionDate)} | 
                Generated: {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click instruction */}
      <div className="text-center mt-4">
        <p className="text-gray-600 text-sm">
          Click to flip card • Hover for 3D effect
        </p>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .hover-lift:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
          transition: transform 0.3s ease;
        }
        
        .bg-pattern-dots {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-pattern-hexagon {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        .holographic-shine {
          animation: holographicShine 3s ease-in-out infinite;
        }
        
        @keyframes holographicShine {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; transform: scaleY(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .student-id-card-container:hover .preserve-3d {
          animation: float 2s ease-in-out infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .student-id-card-container {
            max-width: 280px;
          }
          
          .preserve-3d {
            height: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentIDCard;