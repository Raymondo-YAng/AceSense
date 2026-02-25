import { Home, PlusSquare, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNavigation() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === '/';
  const isUpload = path === '/upload';
  const isAnalysis = path === '/analysis';
  const isProfile = path === '/profile';

  const NavItem = ({ to, Icon, label, active }) => (
    <Link to={to} className="flex flex-1 flex-col items-center justify-end gap-1">
      <div className={`flex h-8 items-center justify-center ${active ? 'text-white' : 'text-secondary'}`}>
        <Icon size={24} fill={active ? 'currentColor' : 'none'} />
      </div>
      <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${active ? 'text-white' : 'text-secondary'}`}>
        {label}
      </p>
    </Link>
  );

  return (
    <div>
      <div className="flex gap-2 border-t border-[#28392e] bg-surface px-4 pb-3 pt-2">
        <NavItem to="/" Icon={Home} label="Home" active={isHome} />
        <NavItem to="/upload" Icon={PlusSquare} label="Upload" active={isUpload} />
        <NavItem to="/analysis" Icon={Search} label="Analysis" active={isAnalysis} />
        <NavItem to="/profile" Icon={User} label="Profile" active={isProfile} />
      </div>
      <div className="h-5 bg-surface" />
    </div>
  );
}