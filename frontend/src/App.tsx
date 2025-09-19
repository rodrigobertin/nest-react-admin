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
        <PrivateRoute>
          <Route path="/" element={Dashboard} />
        </PrivateRoute>

        <PrivateRoute roles={['admin']}>
          <Route path="/users" element={Users} />
        </PrivateRoute>

        <PrivateRoute>
          <Route path="/courses" element={Courses} />
        </PrivateRoute>

        <PrivateRoute>
          <Route path="/courses/:id" element={Contents} />
        </PrivateRoute>

        <AuthRoute exact path="/login" component={Login} />
      </Routes>
    </BrowserRouter>
  ) : null;
}
