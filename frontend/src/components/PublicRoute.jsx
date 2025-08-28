import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token) {
    if (user?.role === 'patient') {
      return <Navigate to="/patient/dashboard" />;
    } else if (user?.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" />;
    } else if (user?.role === 'admin') {
        return <Navigate to="/admin-dashboard" />;
    }
  }

  return children;
};

export default PublicRoute;