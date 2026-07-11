import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // or a spinner component

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}