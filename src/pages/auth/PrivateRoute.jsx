import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}

export default PrivateRoute
