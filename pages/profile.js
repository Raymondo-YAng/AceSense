import React from 'react';
import { createRoot } from 'react-dom/client';
import BottomNavigation from '../components/BottomNavigation.js';
import { Settings } from 'lucide-react';
import { IMAGES } from '../constants.js';

function StatCard({ value, label }) {
  return React.createElement('div', { className: 'flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-accent p-3 items-center text-center bg-card/20' },
    React.createElement('p', { className: 'text-white tracking-light text-2xl font-bold leading-tight' }, value),
    React.createElement('p', { className: 'text-secondary text-sm font-normal leading-normal' }, label)
  );
}

function AnalysisCard({ image, title, date }) {
  return React.createElement('div', { className: 'flex h-full flex-1 flex-col gap-4 min-w-40 cursor-pointer' },
    React.createElement('div', {
      className: 'w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col shadow-md',
      style: { backgroundImage: `url("${image}")` }
    }),
    React.createElement('div', null,
      React.createElement('p', { className: 'text-white text-base font-medium leading-normal' }, title),
      React.createElement('p', { className: 'text-secondary text-sm font-normal leading-normal' }, date)
    )
  );
}

function ProCard({ image, name }) {
  return React.createElement('div', { className: 'flex flex-col gap-3 pb-3 cursor-pointer' },
    React.createElement('div', {
      className: 'w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg shadow-md',
      style: { backgroundImage: `url("${image}")` }
    }),
    React.createElement('p', { className: 'text-white text-base font-medium leading-normal' }, name)
  );
}

function ProfileView() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // State to manage login status
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return React.createElement('div', { className: 'bg-background min-h-screen flex items-center justify-center' },
      React.createElement('div', { className: 'bg-card p-8 rounded-lg shadow-lg w-96' },
        React.createElement('h2', { className: 'text-white text-2xl font-bold mb-6 text-center' }, 'Login'),
        error && React.createElement('p', { className: 'text-danger text-center mb-4' }, error),
        React.createElement('form', { onSubmit: handleLogin, className: 'flex flex-col gap-4' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Username',
            className: 'p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary',
            value: username,
            onChange: (e) => setUsername(e.target.value),
            required: true,
          }),
          React.createElement('input', {
            type: 'password',
            placeholder: 'Password',
            className: 'p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          }),
          React.createElement('button', {
            type: 'submit',
            className: 'bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80 transition-colors',
          }, 'Login')
        )
      )
    );
  }

  return React.createElement('div', { className: 'bg-background pb-8' },
    React.createElement('div', { className: 'flex items-center p-4 pb-2 justify-between' },
      React.createElement('h2', { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12' }, 'Profile'),
      React.createElement('div', { className: 'flex w-12 items-center justify-end' },
        React.createElement('button', { className: 'text-white p-2 rounded-full hover:bg-white/10 transition-colors' },
          React.createElement(Settings, { size: 24 })
        )
      )
    ),

    React.createElement('div', { className: 'flex p-4 flex-col items-center gap-4' },
      React.createElement('div', { className: 'flex flex-col items-center gap-4' },
        React.createElement('div', {
          className: 'bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-card',
          style: { backgroundImage: `url("${IMAGES.USER_AVATAR}")` }
        }),
        React.createElement('div', { className: 'flex flex-col items-center justify-center' },
          React.createElement('p', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center' }, 'Ethan Carter'),
          React.createElement('p', { className: 'text-secondary text-base font-normal leading-normal text-center' }, 'Pro Tennis Player'),
          React.createElement('p', { className: 'text-secondary text-base font-normal leading-normal text-center' }, 'Joined 2022')
        )
      )
    ),

    React.createElement('div', { className: 'flex flex-wrap gap-3 px-4 py-3' },
      React.createElement(StatCard, { value: '120', label: 'Swings Analyzed' }),
      React.createElement(StatCard, { value: '85%', label: 'Accuracy' }),
      React.createElement(StatCard, { value: '4.8', label: 'Avg. Rating' })
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, 'Recent Analysis'),
    React.createElement('div', { className: 'flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar' },
      React.createElement(AnalysisCard, { image: IMAGES.SWINGS.FOREHAND, title: 'Forehand Swing', date: '2024-07-20' }),
      React.createElement(AnalysisCard, { image: IMAGES.SWINGS.BACKHAND, title: 'Backhand Swing', date: '2024-07-15' }),
      React.createElement(AnalysisCard, { image: IMAGES.SWINGS.SERVE, title: 'Serve', date: '2024-07-10' })
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, 'Pro Swings Library'),
    React.createElement('div', { className: 'grid grid-cols-2 gap-3 p-4' },
      React.createElement(ProCard, { image: IMAGES.PROS.FEDERER, name: 'Roger Federer' }),
      React.createElement(ProCard, { image: IMAGES.PROS.SERENA, name: 'Serena Williams' }),
      React.createElement(ProCard, { image: IMAGES.PROS.NADAL, name: 'Rafael Nadal' })
    )
  );
}

function App() {
  return React.createElement(
    'div',
    { className: 'flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative' },
    React.createElement('div', { className: 'flex-1 overflow-y-auto no-scrollbar' }, React.createElement(ProfileView)),
    React.createElement(BottomNavigation)
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(React.createElement(App));