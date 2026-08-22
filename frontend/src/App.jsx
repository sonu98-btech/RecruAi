import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { loadCurrentUser } from './redux/slices/authSlice';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Clients from './pages/Clients';
import Calls from './pages/Calls';
import AIAnalyzer from './pages/AIAnalyzer';
import Followups from './pages/Followups';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Team from './pages/Team';

// App Wrapper to handle layout and auth bootstrap loading states
const AppContent = () => {
  const dispatch = useDispatch();
  const { currentUser, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  // While checking initial authentication cookie
  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 flex">
      {currentUser && !isAuthRoute && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0">
        {currentUser && !isAuthRoute && <Navbar />}
        <main className="flex-1 flex flex-col">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />

            {/* Dashboard and CRM features protected */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER']}><Clients /></ProtectedRoute>} />
            <Route path="/calls" element={<ProtectedRoute><Calls /></ProtectedRoute>} />
            <Route path="/ai-analyzer" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER']}><AIAnalyzer /></ProtectedRoute>} />
            <Route path="/followups" element={<ProtectedRoute><Followups /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER']}><Campaigns /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER']}><Analytics /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN']}><Team /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
