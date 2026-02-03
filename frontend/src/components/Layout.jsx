import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { logout as logoutApi } from '../services/authService';
import './Layout.css';

export default function Layout({ children }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logoutApi()
      .catch(() => {})
      .finally(() => {
        dispatch(clearUser());
        setProfileOpen(false);
        navigate('/');
      });
  }

  return (
    <div className="layout">
      <aside className="layout-sidebar">
        {/* Blank sidebar */}
      </aside>
      <div className="layout-main">
        <header className="layout-navbar">
          <div className="navbar-placeholder" />
          <div className="navbar-profile" ref={dropdownRef}>
            <button
              type="button"
              className="profile-btn"
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="profile-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span>Profile</span>
              <span className="profile-chevron">▼</span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                {user?.email && <div className="profile-email">{user.email}</div>}
                <button type="button" className="profile-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
