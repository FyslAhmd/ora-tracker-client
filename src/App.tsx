import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAuth } from '@/hooks';
import { fetchCurrentUser } from '@/features/auth/authSlice';
import { MainLayout } from '@/components/layout';
import { AuthGuard, RoleGuard } from '@/components/guards';
import { LoadingSpinner } from '@/components/ui';
import { Login, Register, Dashboard, ORSPlans, Users, Analytics } from '@/pages';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Try to fetch current user if we have a token
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (token && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/ors-plans" element={<ORSPlans />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={['admin']} fallback="message">
                <Users />
              </RoleGuard>
            }
          />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
