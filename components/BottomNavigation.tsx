import React from 'react';
import { Home, PlusSquare, Search, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const NavItem: React.FC<{
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}> = ({ to, icon: Icon, label, isActive }) => (
  <Link to={to} className="flex flex-1 flex-col items-center justify-end gap-1">
    <div className={`flex h-8 items-center justify-center ${isActive ? 'text-white' : 'text-secondary'}`}>
      <Icon size={24} fill={isActive ? "currentColor" : "none"} />
    </div>
    <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${isActive ? 'text-white' : 'text-secondary'}`}>
      {label}
    </p>
  </Link>
);

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <div className="flex gap-2 border-t border-[#28392e] bg-surface px-4 pb-3 pt-2">
        <NavItem to="/" icon={Home} label="Home" isActive={location.pathname === '/'} />
        <NavItem to="/upload" icon={PlusSquare} label="Upload" isActive={location.pathname === '/upload'} />
        <NavItem to="/analysis" icon={Search} label="Analysis" isActive={location.pathname === '/analysis'} />
        <NavItem to="/profile" icon={User} label="Profile" isActive={location.pathname === '/profile'} />
      </div>
      <div className="h-5 bg-surface"></div>
    </div>
  );
};

export default BottomNavigation;