import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerCompany, loadCurrentUser, clearError } from '../redux/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, initialized, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (companyData) => dispatch(registerCompany(companyData));
  const logout = () => dispatch(logoutUser());
  const clearAuthError = () => dispatch(clearError());

  // Check if role is allowed
  const hasRole = (allowedRoles) => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  return {
    currentUser,
    loading,
    initialized,
    error,
    login,
    register,
    logout,
    clearAuthError,
    hasRole,
    isAdmin: currentUser ? ['SUPER_ADMIN', 'COMPANY_ADMIN'].includes(currentUser.role) : false,
    role: currentUser?.role || null,
    company: currentUser?.companyId || null,
  };
};
