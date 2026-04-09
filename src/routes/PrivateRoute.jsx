import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Profile from '../pages/private/Profile'
import Settings from '../pages/private/Settings'
import MyQuizzes from '../pages/private/MyQuizzes'

const PrivateRoute = ({ children }) => {
  return children
}

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="profile" element={
        <PrivateRoute>
          <Navbar />
          <Profile />
          <Footer />
        </PrivateRoute>
      } />
      <Route path="settings" element={
        <PrivateRoute>
          <Navbar />
          <Settings />
          <Footer />
        </PrivateRoute>
      } />
      <Route path="my-quizzes" element={
        <PrivateRoute>
          <Navbar />
          <MyQuizzes />
          <Footer />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default PrivateRoutes