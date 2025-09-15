import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import ManagementDashboard from './components/ManagementDashboard';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};



const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
<Routes>
  <Route 
    path="/" 
    element={
      isAuthenticated ? (
       <Navigate 
  to={
    user?.role === 'teacher' 
      ? '/teacher' 
      : user?.role === 'parent' 
      ? '/parent' 
      : user?.role === 'management'
      ? '/management'
      : '/'   // <-- default fallback
  } 
  replace 
/>

      ) : (
        <Login />
      )
    } 
  />

  <Route 
    path="/teacher" 
    element={
      <ProtectedRoute>
        {user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />}
      </ProtectedRoute>
    } 
  />

  <Route 
    path="/parent" 
    element={
      <ProtectedRoute>
        {user?.role === 'parent' ? <ParentDashboard /> : <Navigate to="/" replace />}
      </ProtectedRoute>
    } 
  />

<Route 
  path="/management" 
  element={
    <ProtectedRoute>
      {user?.role === 'management' ? <ManagementDashboard /> : <Navigate to="/" replace />}
    </ProtectedRoute>
  } 
/>

</Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
