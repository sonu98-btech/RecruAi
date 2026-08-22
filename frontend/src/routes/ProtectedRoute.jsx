import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from '../redux/slices/authSlice';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser, initialized, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, initialized]);

  if (!initialized || (loading && !currentUser)) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
