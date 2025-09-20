import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Contents from './pages/Contents';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import { AuthRoute, PrivateRoute } from './Route';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      setAuthenticatedUser(authResponse.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded ? (
    <BrowserRouter>
      <Routes>
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/courses" element={<PrivateRoute component={Courses} />} />
        <Route
          path="/courses/:id"
          element={<PrivateRoute component={Contents} />}
        />
        <Route
          path="/users"
          element={<PrivateRoute component={Users} roles={['admin']} />}
        />

        {/* Public route */}
        <Route path="/login" element={<AuthRoute component={Login} />} />
      </Routes>
    </BrowserRouter>
  ) : null;
}
