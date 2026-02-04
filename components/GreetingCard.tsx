
import React, { useRef, useState } from 'react';
import { Download, Loader2, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  author: string;
  authorGen: string; // Ông/Bà
  avatar?: string;
  totalViews: number;
  totalComments: number;
  onClose: () => void;
}

// Custom X Icon (Brand X)
const XIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

const GreetingCard: React.FC<Props> = ({ author, authorGen, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const image = canvas.toDataURL("image/jpeg", 0.9);
      
      const link = document.createElement("a");
      link.href = image;
      link.download = `VnExpress-Cam-On-${author.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Không thể tải ảnh. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'x' | 'copy') => {
    const url = window.location.href;
    const text = `VnExpress gửi lời cảm ơn đến tác giả ${author}.`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const salutation = authorGen ? (authorGen.charAt(0).toUpperCase() + authorGen.slice(1)) : 'Ông/Bà';
  const salutationLower = salutation.toLowerCase();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-black/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-[480px] md:max-w-[504px] flex flex-col items-center">
        
        {/* Capture Area / Card Body */}
        <div 
          ref={cardRef}
          className="relative w-full bg-[#fffdf9] shadow-2xl overflow-hidden rounded-sm animate-scale-up cursor-default flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tet Background Decor */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
            
            {/* Traditional Decor */}
            <svg className="absolute -left-10 -top-10 w-40 h-40 text-vnexpress/5 opacity-30" viewBox="0 0 100 100">
               <path d="M10,40 Q30,20 50,40 T90,40" fill="none" stroke="currentColor" strokeWidth="2" />
               <path d="M5,50 Q25,30 45,50 T85,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="absolute top-3 right-3 w-12 h-12 border-t border-r border-gold/30"></div>
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b border-l border-gold/30"></div>
            
            {/* Traditional Stamp Circle */}
            <div className="absolute -right-16 -bottom-16 w-48 h-48 border border-vnexpress/[0.03] rounded-full"></div>
          </div>

          <div className="absolute inset-4 border border-gold/10 rounded-sm pointer-events-none z-20"></div>

          {/* Card Content */}
          <div className="relative z-10 px-8 md:px-12 py-10 md:py-12 flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full flex flex-col items-center mb-8">
               <div className="mb-4">
                  <img 
                    src="https://s1.vnecdn.net/vnexpress/restruct/i/v9775/v2_2019/pc/graphics/logo.svg" 
                    alt="VnExpress" 
                    crossOrigin="anonymous" 
                    className="h-5 w-auto"
                  />
               </div>
               
               <h2 className="font-script text-5xl text-vnexpress drop-shadow-sm leading-tight mb-6">
                 Thư cảm ơn
               </h2>

               <div className="w-full text-left border-b border-gold/10 pb-2 mb-3">
                  <span className="italic text-xs text-stone-400 font-serif mr-4">Kính gửi:</span>
                  <span className="font-bold text-lg font-serif text-ink">
                     {salutation} {author}
                  </span>
               </div>
            </div>

            {/* Main Message */}
            <div 
              className="text-stone-700 font-serif text-justify space-y-4 w-full"
              style={{ fontSize: '0.85rem', lineHeight: '1.5rem' }}
            >
              <p>
                Trong năm 2025, <span className="text-vnexpress font-bold">Góc nhìn</span> vinh dự đồng hành cùng {salutationLower} <strong className="text-black font-bold">{author}</strong>, mang đến cho độc giả những ý kiến sâu sắc, độc lập và có trách nhiệm.
              </p>
              
              <p>
                Mỗi bài viết không chỉ thể hiện sự am tường mà còn cho thấy tâm huyết và bản lĩnh dấn thân, mang đến góc nhìn mới mẻ và minh triết. Những đóng góp ấy đã cùng chúng tôi định hình bản sắc Góc nhìn - một không gian đối thoại thẳng thắn, đa chiều, mang tinh thần phụng sự.
              </p>

              <p className="font-bold text-ink">
                Chuyên mục Góc nhìn trân trọng cảm ơn {salutationLower}!
              </p>
              
              <p>
                Kính chúc {salutationLower} và gia đình năm mới an khang, thịnh vượng.
              </p>

              <p>
                Chúng tôi mong được tiếp tục đồng hành cùng {salutationLower} <strong className="text-black font-bold">{author}</strong> trên hành trình đối thoại và khai mở tri thức.
              </p>
            </div>

            {/* Signature */}
            <div className="w-full text-right mt-10 space-y-1">
               <p className="font-bold text-black font-serif italic text-sm">Trân trọng,</p>
               <p className="font-sans text-vnexpress font-bold tracking-widest uppercase text-[10px]">Góc nhìn - VnExpress</p>
            </div>
          </div>

          <div className="h-1.5 w-full bg-gradient-to-r from-vnexpress via-gold to-vnexpress opacity-80"></div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 w-full flex items-center justify-between px-2 md:px-0">
            <div className="flex items-center space-x-2">
                 <button onClick={(e) => { e.stopPropagation(); handleShare('facebook'); }} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">
                    <Facebook size={18} strokeWidth={1.5} />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleShare('x'); }} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">
                    <XIcon size={16} />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleShare('copy'); }} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">
                    {copied ? <Check size={18} className="text-green-400" /> : <LinkIcon size={18} strokeWidth={1.5} />}
                 </button>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-6 py-3 bg-vnexpress text-white rounded-full font-bold shadow-xl hover:bg-vnexpress/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span className="text-xs tracking-widest uppercase">Tải thiệp</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
