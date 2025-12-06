import React from 'react';
import { Settings } from 'lucide-react';
import { IMAGES } from '../constants';

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-accent p-3 items-center text-center bg-card/20">
    <p className="text-white tracking-light text-2xl font-bold leading-tight">{value}</p>
    <p className="text-secondary text-sm font-normal leading-normal">{label}</p>
  </div>
);

const AnalysisCard: React.FC<{ image: string; title: string; date: string }> = ({ image, title, date }) => (
  <div className="flex h-full flex-1 flex-col gap-4 min-w-40 cursor-pointer">
    <div
      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col shadow-md"
      style={{ backgroundImage: `url("${image}")` }}
    ></div>
    <div>
      <p className="text-white text-base font-medium leading-normal">{title}</p>
      <p className="text-secondary text-sm font-normal leading-normal">{date}</p>
    </div>
  </div>
);

const ProCard: React.FC<{ image: string; name: string }> = ({ image, name }) => (
  <div className="flex flex-col gap-3 pb-3 cursor-pointer">
    <div
      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg shadow-md"
      style={{ backgroundImage: `url("${image}")` }}
    ></div>
    <p className="text-white text-base font-medium leading-normal">{name}</p>
  </div>
);

const Profile: React.FC = () => {
  return (
    <div className="bg-background pb-8">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          Profile
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex p-4 flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-card"
            style={{ backgroundImage: `url("${IMAGES.USER_AVATAR}")` }}
          ></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">Ethan Carter</p>
            <p className="text-secondary text-base font-normal leading-normal text-center">Pro Tennis Player</p>
            <p className="text-secondary text-base font-normal leading-normal text-center">Joined 2022</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 px-4 py-3">
        <StatCard value="120" label="Swings Analyzed" />
        <StatCard value="85%" label="Accuracy" />
        <StatCard value="4.8" label="Avg. Rating" />
      </div>

      {/* Recent Analysis */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Recent Analysis
      </h2>
      <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar">
        <AnalysisCard image={IMAGES.SWINGS.FOREHAND} title="Forehand Swing" date="2024-07-20" />
        <AnalysisCard image={IMAGES.SWINGS.BACKHAND} title="Backhand Swing" date="2024-07-15" />
        <AnalysisCard image={IMAGES.SWINGS.SERVE} title="Serve" date="2024-07-10" />
      </div>

      {/* Pro Library */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Pro Swings Library
      </h2>
      <div className="grid grid-cols-2 gap-3 p-4">
        <ProCard image={IMAGES.PROS.FEDERER} name="Roger Federer" />
        <ProCard image={IMAGES.PROS.SERENA} name="Serena Williams" />
        <ProCard image={IMAGES.PROS.NADAL} name="Rafael Nadal" />
      </div>
    </div>
  );
};

export default Profile;