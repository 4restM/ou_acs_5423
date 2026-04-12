import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => (location.pathname === path ? 'active' : '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">YogaApp</Link>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>Dashboard</Link></li>
          <li><Link to="/instructors" className={isActive('/instructors')}>Instructors</Link></li>
          <li><Link to="/classes" className={isActive('/classes')}>Classes</Link></li>
        </ul>
        <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;