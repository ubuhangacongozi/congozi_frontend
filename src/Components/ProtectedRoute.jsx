import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "./useUserContext";

const ProtectedRoute = ({ allowedRole }) => {
  const { userRole, loading } = useUserContext();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!userRole) {
    return <Navigate to="/kwinjira" />;
  }

  return userRole === allowedRole ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
