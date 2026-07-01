import React from 'react'
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { college } = useParams();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  // If a specific college route is requested, make sure the logged-in admin belongs to it
  if (college) {
    const adminCollege = localStorage.getItem("adminCollege");
    if (!adminCollege || adminCollege !== college) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute