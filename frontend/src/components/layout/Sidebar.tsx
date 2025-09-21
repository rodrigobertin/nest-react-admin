import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import logo from '../../assets/urbano-logo-white.png';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    navigate('/login');
  };

  return (
    <div className={'sidebar ' + className}>
      <Link to="/" className="no-underline  text-black">
        <img src={logo} alt="" className={'m-auto'} />
      </Link>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/" active={location.pathname === '/'}>
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses" active={location.pathname.includes('/courses')}>
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users" active={location.pathname === '/users'}>
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="link logout rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut /> <span>Logout</span>
      </button>
    </div>
  );
}
