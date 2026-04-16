import { Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PublicRoutes from '../pages/auth/PublicRoutes'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

const ProtectedRoute = () => {
  return (
    <Routes>
      <Route path="login" element={
        <PublicRoutes>
          <Login />
        </PublicRoutes>
      } />
      <Route path="register" element={
        <PublicRoutes>
          <Register />
        </PublicRoutes>
      } />
      <Route path="forgot-password" element={
        <PublicRoutes>
          <ForgotPassword />
        </PublicRoutes>
      } />
      <Route path="reset-password" element={
        <ResetPassword />
      } />
    </Routes>
  )
}

export default ProtectedRoute