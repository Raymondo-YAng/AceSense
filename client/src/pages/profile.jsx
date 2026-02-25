import { useState } from 'react';
import { Settings } from 'lucide-react';
import { IMAGES } from '../constants.jsx';

function StatCard({ value, label }) {
  return (
    <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-accent p-3 items-center text-center bg-card/20">
      <p className="text-white tracking-light text-2xl font-bold leading-tight">{value}</p>
      <p className="text-secondary text-sm font-normal leading-normal">{label}</p>
    </div>
  );
}

function AnalysisCard({ image, title, date }) {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 min-w-40 cursor-pointer">
      <div
        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col shadow-md"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div>
        <p className="text-white text-base font-medium leading-normal">{title}</p>
        <p className="text-secondary text-sm font-normal leading-normal">{date}</p>
      </div>
    </div>
  );
}

function ProCard({ image, name }) {
  return (
    <div className="flex flex-col gap-3 pb-3 cursor-pointer">
      <div
        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg shadow-md"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <p className="text-white text-base font-medium leading-normal">{name}</p>
    </div>
  );
}

export default function ProfileView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-white text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="text-danger text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-md bg-surface text-white border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background pb-8">
      <div className="flex items-center p-4 pb-2 justify-between">
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Profile</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </div>

      <div className="flex p-4 flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-card"
            style={{ backgroundImage: `url("${IMAGES.USER_AVATAR}")` }}
          />
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">Ethan Carter</p>
            <p className="text-secondary text-base font-normal leading-normal text-center">Pro Tennis Player</p>
            <p className="text-secondary text-base font-normal leading-normal text-center">Joined 2022</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-3">
        <StatCard value="120" label="Swings Analyzed" />
        <StatCard value="85%" label="Accuracy" />
        <StatCard value="4.8" label="Avg. Rating" />
      </div>

      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Analysis</h2>
      <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar">
        <AnalysisCard image={IMAGES.SWINGS.FOREHAND} title="Forehand Swing" date="2024-07-20" />
        <AnalysisCard image={IMAGES.SWINGS.BACKHAND} title="Backhand Swing" date="2024-07-15" />
        <AnalysisCard image={IMAGES.SWINGS.SERVE} title="Serve" date="2024-07-10" />
      </div>

      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Pro Swings Library</h2>
      <div className="grid grid-cols-2 gap-3 p-4">
        <ProCard image={IMAGES.PROS.FEDERER} name="Roger Federer" />
        <ProCard image={IMAGES.PROS.SERENA} name="Serena Williams" />
        <ProCard image={IMAGES.PROS.NADAL} name="Rafael Nadal" />
      </div>
    </div>
  );
}