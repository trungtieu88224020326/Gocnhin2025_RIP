
import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

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
          cursor-pointer transform transition-all duration-700 hover:scale-[1.01] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
          border border-gray-200 overflow-hidden paper-texture
        "
      >
        {/* Subtle Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#fafafa]">
          
          {/* Main Maroon Curve - Subtle and Muted */}
          <div className="absolute -left-20 -bottom-20 w-[450px] h-[450px] border-[1px] border-vnexpress/10 rounded-full"></div>
          
          {/* Accent Circle - Top Right */}
          <div className="absolute -right-32 -top-32 w-80 h-80 bg-vnexpress/[0.03] rounded-full blur-3xl"></div>

          {/* Vertical Spine Bar */}
          <div className="absolute left-0 top-0 w-2 h-full bg-vnexpress/80 shadow-sm z-20"></div>
          <div className="absolute left-2 top-0 w-[1px] h-full bg-gray-200 z-10"></div>

          {/* Memorial Symbol - Top Left */}
          <div className="absolute top-8 left-8 z-30 opacity-20">
             <Heart size={16} fill="currentColor" className="text-vnexpress" />
          </div>
        </div>

        {/* Top Trim */}
        <div className="w-full flex justify-center relative z-10 mt-8">
           <div className="w-10 h-[2px] bg-vnexpress/30 rounded-full"></div>
        </div>

        <div className="flex-1 w-full p-10 lg:p-16 flex flex-col items-center text-center relative z-10">
            <div className="mb-16 lg:mb-24 opacity-80">
                <img 
                  src="https://s1.vnecdn.net/vnexpress/restruct/i/v9775/v2_2019/pc/graphics/logo.svg" 
                  alt="VnExpress" 
                  className="h-8 lg:h-10 w-auto grayscale"
                />
            </div>

            <div className="mb-10 flex items-center space-x-4">
               <div className="h-[1px] w-6 bg-vnexpress/20"></div>
               <span className="text-[10px] lg:text-[11px] font-sans font-bold tracking-[0.4em] text-vnexpress/50 uppercase">
                  Ấn bản hoài niệm 2025
               </span>
               <div className="h-[1px] w-6 bg-vnexpress/20"></div>
            </div>

            <div className="relative mb-14 px-4">
               <h1 
                 className="text-4xl lg:text-6xl font-bold text-memorial-ink tracking-tight leading-none select-none whitespace-nowrap"
                 style={{ fontFamily: "'Merriweather', serif" }}
               >
                 {title}
               </h1>
               <span className="absolute -left-8 lg:-left-10 top-[-1.5rem] lg:top-[-2.5rem] text-6xl lg:text-8xl text-vnexpress/5 font-serif italic pointer-events-none">“</span>
            </div>
            
            {subtitle && (
              <div className="w-full max-w-[340px] mx-auto relative mt-4">
                 <p className="text-sub-text font-serif text-base lg:text-lg italic leading-relaxed opacity-80 font-light">
                   {subtitle}
                 </p>
                 <div className="mt-10 flex justify-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-vnexpress/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-vnexpress/10"></div>
                 </div>
              </div>
            )}

            <div className="mt-auto flex flex-col items-center group">
                <div className="relative mb-8 cursor-pointer">
                  <div className="absolute -inset-4 border border-vnexpress/10 rounded-full animate-ping opacity-10 group-hover:opacity-20"></div>
                  <div className="relative w-16 h-16 bg-memorial-ink text-white flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:bg-vnexpress">
                      <BookOpen size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-[10px] lg:text-[11px] text-vnexpress font-black font-sans tracking-[0.4em] uppercase opacity-50 group-hover:opacity-100 transition-all">
                   Lật mở di sản
                </span>
            </div>
        </div>

        <div className="w-full px-12 pb-10 flex justify-between items-end relative z-10">
           <div className="text-[9px] font-sans font-bold text-gray-300 tracking-[0.3em] uppercase">
              Góc nhìn VnExpress
           </div>
           <div className="flex space-x-1 items-center">
              <div className="w-8 h-[1px] bg-gray-200"></div>
              <div className="w-1 h-1 rounded-full bg-vnexpress/20"></div>
           </div>
        </div>
        
        <div className="absolute left-[2px] top-0 bottom-0 w-[15px] bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none z-20"></div>
      </div>
    </div>
  );
};

export default CoverPage;
