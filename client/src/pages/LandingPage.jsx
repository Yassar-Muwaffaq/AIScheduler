import fotoAtas from '../assets/Landing Page/atas.png';
import fotoBawah from '../assets/Landing Page/bawah.png';
import { AlarmClock } from 'lucide-react';

const ScheduleAiLandingPage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden select-none">

      {/* TOP-LEFT BG IMAGE */}
      <img
        src={fotoAtas}
        alt=""
        className="pointer-events-none absolute top-0 left-0 w-[45vw] max-w-[550px] opacity-60 object-contain"
      />

      {/* BOTTOM-RIGHT BG IMAGE */}
      <img
        src={fotoBawah}
        alt=""
        className="pointer-events-none absolute bottom-0 right-0 w-[45vw] max-w-[550px] opacity-60 object-contain"
      />

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* HERO SECTION */}
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <div className="max-w-4xl">

            {/* ICON WRAPPER */}
            <div className="p-[2px] mb-6 rounded-3xl bg-gradient-to-t from-[#666] to-[#fff] inline-block">
              <div className="p-5 rounded-3xl bg-linear-to-t from-[#30637F] via-[#025480] to-[#000609]">
                <AlarmClock size={48} className="text-blue-400 drop-shadow-[0_0_8px_rgba(0,150,255,0.6)]" />
              </div>
            </div>

            <h1 className="font-dm font-normal text-7xl md:text-8xl tracking-tight mb-4 
    bg-gradient-to-l from-[#00A6FF] via-[#67CAFF] to-[#ffffff]
    bg-clip-text text-transparent">
              Schedule.ai
            </h1>


            {/* SUB TEXT */}
            <p className="text-lg text-gray-300 mb-12 max-w-xl mx-auto leading-relaxed">
              A smart scheduling AI that organizes tasks, adapts quickly, and ensures effortless productivity.
            </p>

            {/* BUTTONS */}
            <div className="flex justify-center gap-6">
              <button className="px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300
                                 bg-gradient-to-r from-black to-[#2F88FF] 
                                 hover:from-blue-600 hover:to-blue-400 
                                 shadow-lg shadow-blue-500/40 hover:shadow-blue-400/60
                                 border border-blue-400/60">
                Create New Task
              </button>

              <button className="px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300
                                 bg-gray-800/40 backdrop-blur-sm 
                                 text-white hover:bg-gray-700/60
                                 border border-gray-600/40 hover:border-blue-400/50">
                Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleAiLandingPage;
