import React from 'react';
import { createRoot } from 'react-dom/client';
import BottomNavigation from '../components/BottomNavigation.js';
import { Settings } from 'lucide-react';
import { IMAGES, API_BASE_URL } from '../constants.js';

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
  const [authMode, setAuthMode] = React.useState('login');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [profileData, setProfileData] = React.useState(null);

  const resetMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
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
      const profileInfo = { username };
      localStorage.setItem('profile_data', JSON.stringify(profileInfo));
      setProfileData(profileInfo);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedProfile = localStorage.getItem('profile_data');
    if (token && storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfileData(parsed);
        setUsername(parsed.username || '');
      } catch (parseError) {
        console.error('Failed to parse stored profile data', parseError);
        localStorage.removeItem('profile_data');
      }
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile_data');
    setIsLoggedIn(false);
    setProfileData(null);
    setUsername('');
    setPassword('');
    resetMessages();
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    resetMessages();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      await response.json();
      setSuccessMessage('Account created successfully. Please log in.');
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return React.createElement('div', { className: 'bg-background min-h-screen flex items-center justify-center' },
      React.createElement('div', { className: 'bg-card p-8 rounded-lg shadow-lg w-96' },
        React.createElement('div', { className: 'flex gap-2 mb-6 bg-background/40 p-1 rounded-full' },
          React.createElement('button', {
            className: `flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${authMode === 'login' ? 'bg-primary text-background' : 'text-secondary hover:text-white'}`,
            onClick: () => {
              setAuthMode('login');
              resetMessages();
            },
            type: 'button'
          }, 'Login'),
          React.createElement('button', {
            className: `flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${authMode === 'register' ? 'bg-primary text-background' : 'text-secondary hover:text-white'}`,
            onClick: () => {
              setAuthMode('register');
              resetMessages();
            },
            type: 'button'
          }, 'Register')
        ),
        React.createElement('h2', { className: 'text-white text-2xl font-bold mb-4 text-center' }, authMode === 'login' ? 'Welcome back' : 'Create your account'),
        error && React.createElement('p', { className: 'text-danger text-center mb-4' }, error),
        successMessage && React.createElement('p', { className: 'text-success text-center mb-4' }, successMessage),
        authMode === 'login'
          ? React.createElement('form', { onSubmit: handleLogin, className: 'flex flex-col gap-4' },
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
          : React.createElement('form', { onSubmit: handleRegister, className: 'flex flex-col gap-4' },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Username',
                className: 'p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary',
                value: username,
                onChange: (e) => setUsername(e.target.value),
                required: true,
              }),
              React.createElement('input', {
                type: 'email',
                placeholder: 'Email',
                className: 'p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary',
                value: email,
                onChange: (e) => setEmail(e.target.value),
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
              React.createElement('input', {
                type: 'password',
                placeholder: 'Confirm Password',
                className: 'p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary',
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                required: true,
              }),
              React.createElement('button', {
                type: 'submit',
                className: 'bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80 transition-colors',
              }, 'Create Account')
            )
      )
    );
  }

  return React.createElement('div', { className: 'bg-background pb-8' },
    React.createElement('div', { className: 'flex items-center p-4 pb-2 justify-between' },
      React.createElement('h2', { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12' }, 'Profile'),
      React.createElement('div', { className: 'flex w-12 items-center justify-end' },
        isLoggedIn ? (
          React.createElement('button', {
            onClick: handleLogout,
            className: 'text-white text-sm font-semibold'
          }, 'Logout')
        ) : (
          React.createElement('button', { className: 'text-white p-2 rounded-full hover:bg-white/10 transition-colors' },
            React.createElement(Settings, { size: 24 })
          )
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
          React.createElement('p', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center' },
            profileData?.username || 'Your Name'
          ),
          React.createElement('p', { className: 'text-secondary text-base font-normal leading-normal text-center' }, 'AceSense Member'),
          React.createElement('p', { className: 'text-secondary text-base font-normal leading-normal text-center' }, 'Joined 2026')
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