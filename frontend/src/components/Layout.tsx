import { NavLink, Outlet } from 'react-router-dom';
import { AppLogo } from './AppLogo';
import { useAuth } from '../context/AuthContext';
import { APP_TITLE, AUTH, NAV, USER_ROLE_LABELS } from '../constants/my';

export function Layout() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-brand">
          <AppLogo size={36} />
          <h1 className="header-title">{APP_TITLE}</h1>
        </div>
        <div className="header-user">
          <span>
            {AUTH.welcome} — {user?.username}
            {user?.rank ? ` (${user.rank})` : ''}
            {' · '}
            {user?.role ? USER_ROLE_LABELS[user.role] : ''}
          </span>
          <button type="button" className="btn btn-outline" onClick={logout}>
            {NAV.logout}
          </button>
        </div>
      </header>

      <nav className="sidebar">
        <NavLink to="/" end className={navClass}>
          {NAV.dashboard}
        </NavLink>
        <NavLink to="/people" className={navClass}>
          {NAV.people}
        </NavLink>
        <NavLink to="/incidents" className={navClass}>
          {NAV.incidents}
        </NavLink>
        <NavLink to="/records" className={navClass}>
          {NAV.records}
        </NavLink>
        <NavLink to="/vehicles" className={navClass}>
          {NAV.vehicles}
        </NavLink>
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
