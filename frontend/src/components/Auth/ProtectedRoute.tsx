import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

// Simplified for now - in real app, use Context or Amplify Hub
export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            await getCurrentUser();
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
