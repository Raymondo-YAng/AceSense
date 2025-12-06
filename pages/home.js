import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from '../components/Button.js';
import BottomNavigation from '../components/BottomNavigation.js';
import { IMAGES } from '../constants.js';

function HomeView() {
  return React.createElement(
    'div',
    { className: 'flex flex-col h-full justify-between pb-4' },
    React.createElement(
      'div',
      { className: 'flex-1' },
      React.createElement('div', { className: '@container' },
        React.createElement('div', { className: 'px-4 py-3' },
          React.createElement('div', {
            className: 'w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-lg min-h-80 shadow-lg',
            style: { backgroundImage: `url("${IMAGES.HOME_HERO}")` }
          })
        )
      ),
      React.createElement('h2', { className: 'text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5' }, 'Analyze your tennis swing'),
      React.createElement('p', { className: 'text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center' }, 'Compare your swing to the pros and get personalized tips to improve your game.')
    ),
    React.createElement('div', { className: 'px-4 py-3' },
      React.createElement(Button, { fullWidth: true, onClick: () => { window.location.href = './upload.html'; } }, 'Get Started')
    )
  );
}

function App() {
  return React.createElement(
    'div',
    { className: 'flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative' },
    React.createElement('div', { className: 'flex-1 overflow-y-auto no-scrollbar' }, React.createElement(HomeView)),
    React.createElement(BottomNavigation)
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(React.createElement(App));