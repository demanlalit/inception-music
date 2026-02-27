import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import PlayerBar from './PlayerBar';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/library', label: 'Library' },
  { path: '/upload', label: 'Upload' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentSong } = usePlayer();

  return (
    <div className="app-shell">
      <div className="app-main">
        <aside className="sidebar">
          <div className="sidebar-title">Inception Music</div>
          <nav>
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link${
                  location.pathname === item.path ? ' active' : ''
                }`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
            <div className="pill">Logged in</div>
            <div style={{ marginTop: '0.35rem' }}>{user?.name}</div>
            <button
              className="btn-outline"
              style={{ marginTop: '0.6rem', width: '100%' }}
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button
              className="btn"
              style={{ marginTop: '0.4rem', width: '100%' }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </aside>

        <main>
          <header className="topbar">
            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              {currentSong ? 'Now playing' : 'Welcome back'}
            </div>
            <input
              className="search-input"
              placeholder="Search is on Home"
              disabled
            />
          </header>
          <section className="page">{children}</section>
        </main>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Layout;

