import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Profile from '../pages/private/Profile';
import Settings from '../pages/private/Settings';
import MyQuizzes from '../pages/private/MyQuizzes';
import TakeQuiz from '../pages/private/TakeQuiz';
import QuizResults from '../pages/private/QuizResults';
import QuizHistory from '../pages/private/QuizHistory';
import AdminDashboard from '../pages/private/AdminDashboard';
import { TestApiComponent } from '../api/TestApi';
import RouteNotFound from '../components/RouteNotFound';
import AuthGuard from '../components/AuthGuard';

const PrivateRoute = ({ children, requiredRole = null }) => {
  return <AuthGuard requiredRole={requiredRole}>{children}</AuthGuard>;
};

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route
        path="/test"
        element={
          <PrivateRoute>
            <TestApiComponent />
          </PrivateRoute>
        }
      />

      <Route
        path="profile"
        element={
          <PrivateRoute>
            <Navbar />
            <Profile />
            <Footer />
          </PrivateRoute>
        }
      />

      <Route
        path="settings"
        element={
          <PrivateRoute>
            <Navbar />
            <Settings />
            <Footer />
          </PrivateRoute>
        }
      />

      <Route
        path="my-quizzes"
        element={
          <PrivateRoute>
            <Navbar />
            <MyQuizzes />
            <Footer />
          </PrivateRoute>
        }
      />

      <Route
        path="take-quiz/:attemptId"
        element={
          <PrivateRoute>
            <TakeQuiz />
          </PrivateRoute>
        }
      />

      <Route
        path="quiz-results/:attemptId"
        element={
          <PrivateRoute>
            <Navbar />
            <QuizResults />
            <Footer />
          </PrivateRoute>
        }
      />

      <Route
        path="quiz-history"
        element={
          <PrivateRoute>
            <Navbar />
            <QuizHistory />
            <Footer />
          </PrivateRoute>
        }
      />

      <Route
        path="admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<RouteNotFound />} />
    </Routes>
  );
};

export default PrivateRoutes;