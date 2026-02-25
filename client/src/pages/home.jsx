import { IMAGES } from '../constants.jsx';
import Button from '../components/Button.jsx';

export default function HomeView() {
  return (
    <div className="flex flex-col h-full justify-between pb-4">
      <div className="flex-1">
        <div className="@container">
          <div className="px-4 py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-lg min-h-80 shadow-lg"
              style={{ backgroundImage: `url("${IMAGES.HOME_HERO}")` }}
            />
          </div>
        </div>
        <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Analyze your tennis swing</h2>
        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Compare your swing to the pros and get personalized tips to improve your game.</p>
      </div>
      <div className="px-4 py-3">
        <Button fullWidth onClick={() => { window.location.href = '/upload'; }}>Get Started</Button>
      </div>
    </div>
  );
}