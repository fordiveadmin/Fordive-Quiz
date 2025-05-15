import React, { useEffect, useState } from 'react';
import { useLocation, Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth-status');
        const data = await response.json();
        setAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Failed to check authentication:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Memverifikasi akses...</span>
      </div>
    );
  }

  if (!authenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <Component />;
};

export default PrivateRoute;