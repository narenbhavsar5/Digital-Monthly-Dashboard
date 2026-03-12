import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider, client } from './graphql/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import RegionManagement from './pages/RegionManagement';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Layout wrapper for authenticated pages to keep Sidebar persistent
function AuthenticatedLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes wrapped in Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                   <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/data-entry" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                   <DataEntry />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/regions" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                   <RegionManagement />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                   <UserProfile />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
