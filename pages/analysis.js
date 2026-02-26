import React from 'react';
import { createRoot } from 'react-dom/client';
import BottomNavigation from '../components/BottomNavigation.js';
import { ArrowLeft, Play, Zap, Target, ArrowRight, Dumbbell } from 'lucide-react';
import { IMAGES, API_BASE_URL } from '../constants.js';

function MetricCard({ label, value, delta, isPositive }) {
  return React.createElement('div', { className: 'flex min-w-[150px] flex-1 flex-col gap-2 rounded-lg p-6 border border-accent bg-card/20' },
    React.createElement('p', { className: 'text-white text-base font-medium leading-normal' }, label),
    React.createElement('p', { className: 'text-white tracking-light text-2xl font-bold leading-tight' }, value),
    React.createElement('p', { className: `text-base font-medium leading-normal ${isPositive ? 'text-success' : 'text-danger'}` }, delta)
  );
}

function ImprovementItem({ icon: Icon, title, desc }) {
  return React.createElement('div', { className: 'flex items-center gap-4 bg-background px-4 min-h-[72px] py-2 border-b border-card/50 last:border-0' },
    React.createElement('div', { className: 'text-white flex items-center justify-center rounded-lg bg-card shrink-0 size-12' },
      React.createElement(Icon, { size: 24 })
    ),
    React.createElement('div', { className: 'flex flex-col justify-center' },
      React.createElement('p', { className: 'text-white text-base font-medium leading-normal line-clamp-1' }, title),
      React.createElement('p', { className: 'text-secondary text-sm font-normal leading-normal line-clamp-2' }, desc)
    )
  );
}

function ExerciseItem({ category, desc }) {
  return React.createElement('div', { className: 'flex gap-4 bg-background px-4 py-3 border-b border-card/50 last:border-0' },
    React.createElement('div', { className: 'text-white flex items-center justify-center rounded-lg bg-card shrink-0 size-12' },
      React.createElement(Dumbbell, { size: 24 })
    ),
    React.createElement('div', { className: 'flex flex-1 flex-col justify-center' },
      React.createElement('p', { className: 'text-white text-base font-medium leading-normal' }, 'Exercises'),
      React.createElement('p', { className: 'text-secondary text-sm font-normal leading-normal' }, category),
      React.createElement('p', { className: 'text-secondary text-sm font-normal leading-normal opacity-80 mt-0.5' }, desc)
    )
  );
}

function AnalysisView() {
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('videoUrl');
    if (url) {
      setVideoUrl(`${API_BASE_URL}${url}`);
    }
  }, []);

  return React.createElement('div', { className: 'bg-background pb-8' },
    React.createElement('div', { className: 'flex items-center bg-background p-4 pb-2 justify-between sticky top-0 z-10' },
      React.createElement('button', { onClick: () => window.history.back(), className: 'text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors' },
        React.createElement(ArrowLeft, { size: 24 })
      ),
      React.createElement('h2', { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12' }, 'Analysis Results')
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, 'Swing Metrics'),
    React.createElement('div', { className: 'flex flex-wrap gap-4 p-4' },
      React.createElement(MetricCard, { label: 'Swing Speed', value: '75 mph', delta: '+5%', isPositive: true }),
      React.createElement(MetricCard, { label: 'Impact Angle', value: '12°', delta: '-2%', isPositive: false }),
      React.createElement(MetricCard, { label: 'Follow Through', value: '80°', delta: '+10%', isPositive: true })
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, videoUrl ? 'Your Analysis Video' : 'Comparison to Pro'),
    React.createElement('div', { className: 'p-4' },
      videoUrl ? 
        React.createElement('div', { className: 'relative aspect-video rounded-lg overflow-hidden bg-card flex items-center justify-center' },
          isError ? 
            React.createElement('div', { className: 'flex flex-col items-center gap-2 p-4 text-center' },
              React.createElement('p', { className: 'text-white font-medium' }, 'Video is being processed...'),
              React.createElement('p', { className: 'text-secondary text-sm' }, 'Please wait a few seconds and refresh the page.'),
              React.createElement('button', { 
                onClick: () => window.location.reload(),
                className: 'mt-2 px-4 py-2 bg-primary text-background rounded-full font-bold text-sm'
              }, 'Refresh Now')
            ) :
            React.createElement('video', {
              src: videoUrl,
              controls: true,
              className: 'w-full h-full object-contain',
              onError: () => setIsError(true),
              autoPlay: true
            })
        ) :
        React.createElement('div', {
          className: 'relative flex items-center justify-center bg-white bg-cover bg-center aspect-video rounded-lg p-4 shadow-lg overflow-hidden group cursor-pointer',
          style: { backgroundImage: `url("${IMAGES.ANALYSIS_VIDEO_PLACEHOLDER}")` }
        },
          React.createElement('div', { className: 'absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors' }),
          React.createElement('button', { className: 'flex shrink-0 items-center justify-center rounded-full size-16 bg-black/40 text-white backdrop-blur-sm z-10 transition-transform group-hover:scale-110' },
            React.createElement(Play, { size: 24, fill: 'currentColor' })
          )
        )
    ),

    React.createElement('div', { className: 'flex flex-wrap gap-4 px-4 py-6' },
      React.createElement('div', { className: 'flex min-w-72 flex-1 flex-col gap-2' },
        React.createElement('p', { className: 'text-white text-base font-medium leading-normal' }, 'Swing Speed Comparison'),
        React.createElement('p', { className: 'text-white tracking-light text-[32px] font-bold leading-tight truncate' }, '75 mph'),
        React.createElement('div', { className: 'grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4' },
          React.createElement('div', { className: 'w-full flex flex-col justify-end h-full' },
            React.createElement('div', { className: 'bg-card border-t-2 border-secondary w-full transition-all duration-1000 ease-out', style: { height: '70%' } })
          ),
          React.createElement('div', { className: 'w-full flex flex-col justify-end h-full' },
            React.createElement('div', { className: 'bg-card border-t-2 border-secondary w-full transition-all duration-1000 ease-out', style: { height: '40%' } })
          ),
          React.createElement('p', { className: 'text-secondary text-[13px] font-bold leading-normal tracking-[0.015em]' }, 'Your Swing'),
          React.createElement('p', { className: 'text-secondary text-[13px] font-bold leading-normal tracking-[0.015em]' }, 'Pro Swing')
        )
      )
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, 'Areas for Improvement'),
    React.createElement('div', { className: 'flex flex-col' },
      React.createElement(ImprovementItem, { icon: Zap, title: 'Swing Speed', desc: 'Focus on generating more power from your legs and core.' }),
      React.createElement(ImprovementItem, { icon: Target, title: 'Impact Angle', desc: 'Adjust your grip to achieve a more optimal impact angle.' }),
      React.createElement(ImprovementItem, { icon: ArrowRight, title: 'Follow Through', desc: 'Extend your arm fully and maintain a smooth follow-through.' })
    ),

    React.createElement('h2', { className: 'text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5' }, 'Suggested Exercises'),
    React.createElement('div', { className: 'flex flex-col' },
      React.createElement(ExerciseItem, { category: 'Swing Speed', desc: 'Medicine Ball Throws: Develops explosive power. Shadow Swings with Resistance Band: Increases swing speed.' }),
      React.createElement(ExerciseItem, { category: 'Impact Angle', desc: 'Grip Adjustment Drills: Improves impact angle. Target Practice: Refines accuracy.' }),
      React.createElement(ExerciseItem, { category: 'Follow Through', desc: 'Smooth Follow-Through Drills: Enhances fluidity. Full Arm Extension Exercises: Improves reach.' })
    )
  );
}

function App() {
  return React.createElement(
    'div',
    { className: 'flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative' },
    React.createElement('div', { className: 'flex-1 overflow-y-auto no-scrollbar' }, React.createElement(AnalysisView)),
    React.createElement(BottomNavigation)
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(React.createElement(App));