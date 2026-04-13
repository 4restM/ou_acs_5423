import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isActive = (path: string) =>
    location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          YogaApp
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/')}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/instructors" className={isActive('/instructors')}>
                Instructors
              </Link>
            </li>
            <li>
              <Link to="/classes" className={isActive('/classes')}>
                Classes
              </Link>
            </li>
          </ul>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faCircleUser} size="lg" />
            </button>
            {dropdownOpen && (
              <>
                <div
                  onClick={() => setDropdownOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    minWidth: '160px',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      color: '#999',
                      cursor: 'not-allowed',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;