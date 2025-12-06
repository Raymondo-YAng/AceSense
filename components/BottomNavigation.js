import React from 'react';
import { Home, PlusSquare, Search, User } from 'lucide-react';

export default function BottomNavigation() {
  const path = window.location.pathname;
  const isHome = path.endsWith('/') || path.endsWith('/index.html');
  const isUpload = path.endsWith('/upload.html');
  const isAnalysis = path.endsWith('/analysis.html');
  const isProfile = path.endsWith('/profile.html');

  const NavItem = ({ href, icon: Icon, label, active }) => (
    React.createElement(
      'a',
      { href, className: 'flex flex-1 flex-col items-center justify-end gap-1' },
      React.createElement(
        'div',
        { className: `flex h-8 items-center justify-center ${active ? 'text-white' : 'text-secondary'}` },
        React.createElement(Icon, { size: 24, fill: active ? 'currentColor' : 'none' })
      ),
      React.createElement(
        'p',
        { className: `text-xs font-medium leading-normal tracking-[0.015em] ${active ? 'text-white' : 'text-secondary'}` },
        label
      )
    )
  );

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'flex gap-2 border-t border-[#28392e] bg-surface px-4 pb-3 pt-2' },
      React.createElement(NavItem, { href: './index.html', icon: Home, label: 'Home', active: isHome }),
      React.createElement(NavItem, { href: './upload.html', icon: PlusSquare, label: 'Upload', active: isUpload }),
      React.createElement(NavItem, { href: './analysis.html', icon: Search, label: 'Analysis', active: isAnalysis }),
      React.createElement(NavItem, { href: './profile.html', icon: User, label: 'Profile', active: isProfile })
    ),
    React.createElement('div', { className: 'h-5 bg-surface' })
  );
}