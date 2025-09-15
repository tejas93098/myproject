import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'with token:', token.substring(0, 20) + '...');
  } else {
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'without token');
  }
  return config;
});

// Handle token expiration and API errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  
  mobileLogin: (data: { phone: string; role: string }) =>
    api.post('/auth/mobile-login', data),
  
  verifyOTP: (data: { phone: string; otp: string; role: string }) =>
    api.post('/auth/verify-otp', data),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  create: (data: any) => api.post('/students', data),
  getById: (id: number) => api.get(`/students/${id}`),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

export const attendanceAPI = {
  getAll: (date?: string) => api.get('/attendance', { params: { date } }),
  create: (data: any) => api.post('/attendance', data),
  getByStudent: (studentId: number) => api.get(`/attendance/student/${studentId}`),
  update: (id: number, data: any) => api.put(`/attendance/${id}`, data),
  delete: (id: number) => api.delete(`/attendance/${id}`),
};

export const gradeAPI = {
  getAll: () => api.get('/grades'),
  create: (data: any) => api.post('/grades', data),
  getByStudent: (studentId: number) => api.get(`/grades/student/${studentId}`),
  update: (id: number, data: any) => api.put(`/grades/${id}`, data),
  delete: (id: number) => api.delete(`/grades/${id}`),
};

export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  create: (data: any) => api.post('/feedback', data),
  getByStudent: (studentId: number) => api.get(`/feedback/student/${studentId}`),
  update: (id: number, data: any) => api.put(`/feedback/${id}`, data),
  delete: (id: number) => api.delete(`/feedback/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getTeacherStats: () => api.get('/dashboard/teacher-stats'),
  getParentStats: () => api.get('/dashboard/parent-stats'),
};

export const scheduleAPI = {
  getAll: () => api.get('/schedule'),
  create: (data: any) => api.post('/schedule', data),
  getById: (id: number) => api.get(`/schedule/${id}`),
  update: (id: number, data: any) => api.put(`/schedule/${id}`, data),
  delete: (id: number) => api.delete(`/schedule/${id}`),
};

export const feesAPI = {
  getAll: () => api.get('/fees'),
  create: (data: any) => api.post('/fees', data),
  delete: (id: number) => api.delete(`/fees/${id}`),
  addPayment: (data: any) => api.post('/fees/payment', data),
};

// NEW: Academic Performance API
export const performanceAPI = {
  getByStudent: (studentId: number) => api.get(`/performance/${studentId}`),
  create: (data: any) => api.post('/performance', data),
  update: (studentId: number, data: any) => api.put(`/performance/${studentId}`, data),
  delete: (studentId: number) => api.delete(`/performance/${studentId}`),
};

// Management API functions with proper error handling and logging
export const managementAPI = {
  // Dashboard Stats
  getStats: () => {
    console.log('Calling management stats API...');
    return api.get('/management/stats');
  },
  
  // Students Management
  getStudents: () => {
    console.log('Calling management students API...');
    return api.get('/management/students');
  },
  createStudent: (data: any) => {
    console.log('Creating student:', data);
    return api.post('/management/students', data);
  },
  updateStudent: (id: number, data: any) => {
    console.log('Updating student:', id, data);
    return api.put(`/management/students/${id}`, data);
  },
  deleteStudent: (id: number) => {
    console.log('Deleting student:', id);
    return api.delete(`/management/students/${id}`);
  },
  
  // Teachers Management
  getTeachers: () => {
    console.log('Calling management teachers API...');
    return api.get('/management/teachers');
  },
  createTeacher: (data: any) => {
    console.log('Creating teacher:', data);
    return api.post('/management/teachers', data);
  },
  updateTeacher: (id: number, data: any) => {
    console.log('Updating teacher:', id, data);
    return api.put(`/management/teachers/${id}`, data);
  },
  deleteTeacher: (id: number) => {
    console.log('Deleting teacher:', id);
    return api.delete(`/management/teachers/${id}`);
  },
  
  // Fees Management
  getFees: () => {
    console.log('Calling management fees API...');
    return api.get('/management/fees');
  },
  createFee: (data: any) => {
    console.log('Creating fee record:', data);
    return api.post('/management/fees', data);
  },
  updateFee: (id: number, data: any) => {
    console.log('Updating fee record:', id, data);
    return api.put(`/management/fees/${id}`, data);
  },
  deleteFee: (id: number) => {
    console.log('Deleting fee record:', id);
    return api.delete(`/management/fees/${id}`);
  },
  recordPayment: (data: any) => {
    console.log('Recording payment:', data);
    return api.post('/management/fees/payment', data);
  },
  
  // Attendance Management
  getAttendance: (filters?: any) => {
    console.log('Calling management attendance API with filters:', filters);
    return api.get('/management/attendance', { params: filters });
  },
  bulkAttendance: (data: any) => {
    console.log('Bulk updating attendance:', data);
    return api.post('/management/attendance/bulk', data);
  },
  
  // Announcements Management
  getAnnouncements: () => {
    console.log('Calling management announcements API...');
    return api.get('/management/announcements');
  },
  createAnnouncement: (data: any) => {
    console.log('Creating announcement:', data);
    return api.post('/management/announcements', data);
  },
  updateAnnouncement: (id: number, data: any) => {
    console.log('Updating announcement:', id, data);
    return api.put(`/management/announcements/${id}`, data);
  },
  deleteAnnouncement: (id: number) => {
    console.log('Deleting announcement:', id);
    return api.delete(`/management/announcements/${id}`);
  },
  publishAnnouncement: (id: number) => {
    console.log('Publishing/unpublishing announcement:', id);
    return api.patch(`/management/announcements/${id}/publish`);
  },
  
  // Performance/Grades Management
  getPerformance: (filters?: any) => {
    console.log('Calling management performance API with filters:', filters);
    return api.get('/management/performance', { params: filters });
  },
  
  // Library Management
  getLibrary: () => {
    console.log('Calling management library API...');
    return api.get('/management/library');
  },
  createLibraryRecord: (data: any) => {
    console.log('Creating library record:', data);
    return api.post('/management/library', data);
  },
  updateLibraryRecord: (id: number, data: any) => {
    console.log('Updating library record:', id, data);
    return api.put(`/management/library/${id}`, data);
  },
  returnBook: (id: number) => {
    console.log('Returning book:', id);
    return api.patch(`/management/library/${id}/return`);
  },
  
  // Transport Management
  getTransport: () => {
    console.log('Calling management transport API...');
    return api.get('/management/transport');
  },
  createRoute: (data: any) => {
    console.log('Creating transport route:', data);
    return api.post('/management/transport', data);
  },
  updateRoute: (id: number, data: any) => {
    console.log('Updating transport route:', id, data);
    return api.put(`/management/transport/${id}`, data);
  },
  deleteRoute: (id: number) => {
    console.log('Deleting transport route:', id);
    return api.delete(`/management/transport/${id}`);
  },
  
  // Reports
  generateReport: (type: string, filters?: any) => {
    console.log('Generating report:', type, filters);
    return api.post(`/management/reports/${type}`, filters);
  },
  exportData: (type: string, format: string, filters?: any) => {
    console.log('Exporting data:', type, format, filters);
    return api.post(`/management/export/${type}`, { format, ...filters }, { responseType: 'blob' });
  },
};

export default api;