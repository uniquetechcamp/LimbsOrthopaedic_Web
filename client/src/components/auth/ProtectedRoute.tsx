import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/hooks/useAuth";
import { useEffect } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredRole?: Role;
};

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!user) {
      // Not logged in, redirect to login
      navigate("/login");
    } else if (requiredRole && user.role !== requiredRole) {
      if (!(requiredRole === "owner" && user.role === "doctor")) {
        // Logged in but does not have the required role
        // (except doctors can access owner routes)
        navigate("/");
      }
    }
  }, [user, requiredRole, navigate]);
  
  // Default content - if navigation didn't happen, render the children
  if (!user) {
    return null; // Render nothing until redirect happens
  }
  
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === "owner" && user.role === "doctor") {
      // Let doctors access some owner routes, but not vice versa
      return children;
    }
    
    return null; // Render nothing until redirect happens
  }
  
  return children;
};
