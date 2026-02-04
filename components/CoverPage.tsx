import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  onOpen: () => void;
  title: string;
  subtitle?: string;
}

const CoverPage: React.FC<Props> = ({ onOpen, title, subtitle }) => {
  return (
    <div className="relative w-full h-full flex justify-center items-center p-4 lg:p-10 perspective-2000">
      <div 
        onClick={onOpen}
        className="
          relative w-full max-w-[550px] h-[85vh] max-h-[800px] 
          bg-white shadow-2xl rounded-sm
          flex flex-col items-center justify-between
          cursor-pointer transform transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
          border border-gray-200 overflow-hidden
        "
      >
        {/* "Harmonic Intersections" Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#fafafa]">
          
          {/* Main Maroon Curve - Bottom Left */}
          <div className="absolute -left-20 -bottom-20 w-[450px] h-[450px] border-[1px] border-vnexpress/20 rounded-full"></div>
          <div className="absolute -left-24 -bottom-24 w-[450px] h-[450px] border-[1px] border-vnexpress/10 rounded-full"></div>
          
          {/* Filled Accent Circle - Top Right */}
          <div className="absolute -right-32 -top-32 w-80 h-80 bg-vnexpress/[0.04] rounded-full blur-2xl"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 border-[2px] border-vnexpress/5 rounded-full"></div>

          {/* Centered Ripple Effect (Subtle) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-vnexpress/[0.03] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-vnexpress/[0.02] rounded-full"></div>

          {/* Vertical Spine Bar with Detail */}
          <div className="absolute left-0 top-0 w-2 h-full bg-vnexpress shadow-sm z-20"></div>
          <div className="absolute left-2 top-0 w-[1px] h-full bg-gray-200 z-10"></div>

          {/* Abstract Floating Nodes */}
          <div className="absolute top-[20%] right-[15%] w-2 h-2 bg-vnexpress/40 rounded-full"></div>
          <div className="absolute top-[22%] right-[14%] w-1 h-1 bg-vnexpress/20 rounded-full"></div>
          <div className="absolute bottom-[15%] left-[10%] w-3 h-3 border border-vnexpress/30 rounded-full"></div>

          {/* Geometric "Perspective" Grid at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, #9f224e 1px, transparent 1px), linear-gradient(to bottom, #9f224e 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Top Trim Detail */}
        <div className="w-full flex justify-center relative z-10 mt-6">
           <div className="w-12 h-1.5 bg-vnexpress rounded-full"></div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full p-10 lg:p-16 flex flex-col items-center text-center relative z-10">
            
            {/* VnExpress Logo */}
            <div className="mb-16 lg:mb-20">
                <img 
                  src="https://s1.vnecdn.net/vnexpress/restruct/i/v9775/v2_2019/pc/graphics/logo.svg" 
                  alt="VnExpress" 
                  className="h-9 lg:h-11 w-auto drop-shadow-sm opacity-90"
                />
            </div>

            {/* Book Year/Edition Label */}
            <div className="mb-8 flex items-center space-x-3">
               <div className="h-[1px] w-8 bg-vnexpress/30"></div>
               <span className="text-[10px] lg:text-[12px] font-sans font-bold tracking-[0.4em] text-vnexpress/60 uppercase">
                  Ấn bản 2025
               </span>
               <div className="h-[1px] w-8 bg-vnexpress/30"></div>
            </div>

            {/* Title Section with unique layout */}
            <div className="relative mb-14 px-4">
               <h1 
                 className="text-4xl lg:text-[4.5rem] font-bold text-vnexpress tracking-tight leading-none select-none whitespace-nowrap"
                 style={{ fontFamily: "'Merriweather', serif" }}
               >
                 {title}
               </h1>
               {/* Decorative floating quote marks */}
               <span className="absolute -left-10 lg:-left-12 top-[-1rem] lg:top-[-2rem] text-6xl lg:text-8xl text-vnexpress/5 font-serif italic pointer-events-none">“</span>
               <span className="absolute -right-10 lg:-right-12 bottom-[-1rem] lg:bottom-[-2rem] text-6xl lg:text-8xl text-vnexpress/5 font-serif italic rotate-180 pointer-events-none">“</span>
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <div className="w-full max-w-[320px] mx-auto relative">
                 <p className="text-sub-text font-serif text-base lg:text-lg font-light italic leading-relaxed opacity-90">
                   {subtitle}
                 </p>
                 <div className="mt-8 flex justify-center space-x-1.5">
                    <div className="w-1 h-1 rounded-full bg-vnexpress"></div>
                    <div className="w-1 h-1 rounded-full bg-vnexpress/40"></div>
                    <div className="w-1 h-1 rounded-full bg-vnexpress/10"></div>
                 </div>
              </div>
            )}

            {/* Interactive Section */}
            <div className="mt-auto flex flex-col items-center group">
                <div className="relative mb-6 cursor-pointer">
                  {/* Outer pulse ring */}
                  <div className="absolute -inset-4 border border-vnexpress/20 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                  
                  <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-vnexpress text-white flex items-center justify-center rounded-full shadow-xl transition-all duration-300 transform group-hover:scale-110">
                      {/* Fix: Removed invalid 'lg:size' prop from BookOpen component as Lucide icons only support a numeric 'size' prop */}
                      <BookOpen size={32} strokeWidth={1.5} />
                  </div>
                </div>
                
                <span className="text-[10px] lg:text-[11px] text-vnexpress font-black font-sans tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                   Lật mở trang đầu
                </span>
            </div>
        </div>

        {/* Bottom Page Edge Decor */}
        <div className="w-full px-12 pb-8 flex justify-between items-end relative z-10">
           <div className="text-[9px] font-sans font-medium text-gray-300 tracking-widest uppercase">
              VnExpress.net
           </div>
           <div className="flex space-x-1">
              <div className="w-4 h-[1px] bg-gray-200"></div>
              <div className="w-12 h-[1px] bg-vnexpress/20"></div>
           </div>
        </div>
        
        {/* Spine Effects for Realism */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-black/5 z-20"></div>
        <div className="absolute left-[2px] top-0 bottom-0 w-[12px] bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none z-20"></div>
      </div>
    </div>
  );
};

export default CoverPage;