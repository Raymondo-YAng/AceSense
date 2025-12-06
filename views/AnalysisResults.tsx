import React from 'react';
import { ArrowLeft, Play, Zap, Target, ArrowRight, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

const MetricCard: React.FC<{ label: string; value: string; delta: string; isPositive: boolean }> = ({ label, value, delta, isPositive }) => (
  <div className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-lg p-6 border border-accent bg-card/20">
    <p className="text-white text-base font-medium leading-normal">{label}</p>
    <p className="text-white tracking-light text-2xl font-bold leading-tight">{value}</p>
    <p className={`text-base font-medium leading-normal ${isPositive ? 'text-success' : 'text-danger'}`}>
      {delta}
    </p>
  </div>
);

const ImprovementItem: React.FC<{ icon: React.ElementType; title: string; desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-background px-4 min-h-[72px] py-2 border-b border-card/50 last:border-0">
    <div className="text-white flex items-center justify-center rounded-lg bg-card shrink-0 size-12">
      <Icon size={24} />
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-white text-base font-medium leading-normal line-clamp-1">{title}</p>
      <p className="text-secondary text-sm font-normal leading-normal line-clamp-2">{desc}</p>
    </div>
  </div>
);

const ExerciseItem: React.FC<{ category: string; desc: string }> = ({ category, desc }) => (
  <div className="flex gap-4 bg-background px-4 py-3 border-b border-card/50 last:border-0">
    <div className="text-white flex items-center justify-center rounded-lg bg-card shrink-0 size-12">
      <Dumbbell size={24} />
    </div>
    <div className="flex flex-1 flex-col justify-center">
      <p className="text-white text-base font-medium leading-normal">Exercises</p>
      <p className="text-secondary text-sm font-normal leading-normal">{category}</p>
      <p className="text-secondary text-sm font-normal leading-normal opacity-80 mt-0.5">
        {desc}
      </p>
    </div>
  </div>
);

const AnalysisResults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background pb-8">
      {/* Header */}
      <div className="flex items-center bg-background p-4 pb-2 justify-between sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Analysis Results
        </h2>
      </div>

      {/* Metrics */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Swing Metrics
      </h2>
      <div className="flex flex-wrap gap-4 p-4">
        <MetricCard label="Swing Speed" value="75 mph" delta="+5%" isPositive={true} />
        <MetricCard label="Impact Angle" value="12°" delta="-2%" isPositive={false} />
        <MetricCard label="Follow Through" value="80°" delta="+10%" isPositive={true} />
      </div>

      {/* Comparison Video */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Comparison to Pro
      </h2>
      <div className="p-4">
        <div
          className="relative flex items-center justify-center bg-white bg-cover bg-center aspect-video rounded-lg p-4 shadow-lg overflow-hidden group cursor-pointer"
          style={{ backgroundImage: `url("${IMAGES.ANALYSIS_VIDEO_PLACEHOLDER}")` }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
          <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/40 text-white backdrop-blur-sm z-10 transition-transform group-hover:scale-110">
            <Play size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Speed Comparison Chart */}
      <div className="flex flex-wrap gap-4 px-4 py-6">
        <div className="flex min-w-72 flex-1 flex-col gap-2">
          <p className="text-white text-base font-medium leading-normal">Swing Speed Comparison</p>
          <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">75 mph</p>
          
          <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
            {/* Your Swing Bar */}
            <div className="w-full flex flex-col justify-end h-full">
              <div className="bg-card border-t-2 border-secondary w-full transition-all duration-1000 ease-out" style={{ height: '70%' }}></div>
            </div>
            {/* Pro Swing Bar */}
            <div className="w-full flex flex-col justify-end h-full">
              <div className="bg-card border-t-2 border-secondary w-full transition-all duration-1000 ease-out" style={{ height: '40%' }}></div>
            </div>
            
            <p className="text-secondary text-[13px] font-bold leading-normal tracking-[0.015em]">Your Swing</p>
            <p className="text-secondary text-[13px] font-bold leading-normal tracking-[0.015em]">Pro Swing</p>
          </div>
        </div>
      </div>

      {/* Areas for Improvement */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Areas for Improvement
      </h2>
      <div className="flex flex-col">
        <ImprovementItem icon={Zap} title="Swing Speed" desc="Focus on generating more power from your legs and core." />
        <ImprovementItem icon={Target} title="Impact Angle" desc="Adjust your grip to achieve a more optimal impact angle." />
        <ImprovementItem icon={ArrowRight} title="Follow Through" desc="Extend your arm fully and maintain a smooth follow-through." />
      </div>

      {/* Suggested Exercises */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Suggested Exercises
      </h2>
      <div className="flex flex-col">
        <ExerciseItem category="Swing Speed" desc="Medicine Ball Throws: Develops explosive power. Shadow Swings with Resistance Band: Increases swing speed." />
        <ExerciseItem category="Impact Angle" desc="Grip Adjustment Drills: Improves impact angle. Target Practice: Refines accuracy." />
        <ExerciseItem category="Follow Through" desc="Smooth Follow-Through Drills: Enhances fluidity. Full Arm Extension Exercises: Improves reach." />
      </div>
    </div>
  );
};

export default AnalysisResults;