import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './components/Auth';
import ProductPage from './pages/ProductPage';
import './App.css';

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const user = useSelector((state) => state.auth.user);
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/products" replace /> : <Auth />} />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <main className="app">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </main>
  );
}

export default App;
