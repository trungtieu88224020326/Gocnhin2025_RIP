
import React, { useRef, useState } from 'react';
import { Download, Loader2, Facebook, Link as LinkIcon, Check, Heart } from 'lucide-react';
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

      const image = canvas.toDataURL("image/jpeg", 0.95);
      
      const link = document.createElement("a");
      link.href = image;
      link.download = `VnExpress-Tuong-Nho-${author.replace(/\s+/g, '-')}.jpg`;
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
    const text = `VnExpress gửi lời tri ân và thành kính tưởng nhớ tác giả ${author}.`;

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

  // Logic danh xưng mặc định: Ưu tiên "Ông" cho không gian tưởng nhớ trang trọng
  const salutation = (authorGen && authorGen !== 'Ông/Bà') ? (authorGen.charAt(0).toUpperCase() + authorGen.slice(1)) : 'Ông';
  const salutationLower = salutation.toLowerCase();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-[480px] md:max-w-[520px] flex flex-col items-center">
        
        {/* Capture Area / Card Body */}
        <div 
          ref={cardRef}
          className="relative w-full bg-[#fffdf9] shadow-2xl overflow-hidden rounded-sm animate-scale-up cursor-default flex flex-col border border-gold/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Elegant Background Decor */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
            
            {/* Subtle Curves */}
            <svg className="absolute -left-10 -top-10 w-48 h-48 text-gold/10 opacity-40" viewBox="0 0 100 100">
               <path d="M10,40 Q30,20 50,40 T90,40" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            {/* Traditional Gold Borders */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-gold/30"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-gold/30"></div>
            
            {/* Decorative Corner Ribbon (Memorial) */}
            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-black/10 origin-left rotate-45 translate-y-6"></div>
            </div>
          </div>

          <div className="absolute inset-6 border border-gold/10 rounded-sm pointer-events-none z-20"></div>

          {/* Card Content */}
          <div className="relative z-10 px-10 md:px-14 py-12 md:py-16 flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full flex flex-col items-center mb-10">
               <div className="mb-6 opacity-60">
                  <img 
                    src="https://s1.vnecdn.net/vnexpress/restruct/i/v9775/v2_2019/pc/graphics/logo.svg" 
                    alt="VnExpress" 
                    crossOrigin="anonymous" 
                    className="h-4 w-auto grayscale"
                  />
               </div>
               
               <h2 className="font-script text-5xl md:text-6xl text-vnexpress drop-shadow-sm leading-tight mb-8">
                 Thư tưởng nhớ
               </h2>

               <div className="w-full text-center border-b border-gold/15 pb-4 mb-6">
                  <span className="italic text-xs text-stone-400 font-serif block mb-2">Kính tưởng nhớ</span>
                  <span className="font-bold text-xl md:text-2xl font-serif text-ink tracking-tight">
                     {salutation} {author}
                  </span>
               </div>
            </div>

            {/* Main Message (Updated Content) */}
            <div 
              className="text-stone-700 font-serif text-justify space-y-6 w-full italic"
              style={{ fontSize: '0.92rem', lineHeight: '1.7rem' }}
            >
              <p>
                Dù tác giả <strong className="text-black not-italic">{author}</strong> không còn hiện diện, những ý kiến tâm huyết, sâu sắc và đầy trách nhiệm của {salutationLower} vẫn tiếp tục được lưu giữ trong ký ức bạn đọc và bồi đắp cho hành trình phát triển của chuyên mục Góc nhìn.
              </p>
              
              <p>
                Mỗi bài viết để lại sẽ góp phần nuôi dưỡng tư duy độc lập, tinh thần đối thoại thẳng thắn và đa chiều - những giá trị cốt lõi mà Góc nhìn luôn kiên trì theo đuổi và gìn giữ.
              </p>

              <p>
                Những đóng góp của <strong className="text-black not-italic">{salutationLower} {author}</strong> đã trở thành một phần di sản tinh thần quý giá của chuyên mục Góc nhìn - VnExpress.
              </p>
            </div>

            {/* Signature */}
            <div className="w-full text-right mt-14 space-y-2">
               <div className="flex justify-end items-center space-x-2 text-vnexpress/40 mb-1">
                  <div className="h-[1px] w-8 bg-current"></div>
                  <Heart size={12} fill="currentColor" />
               </div>
               <p className="font-bold text-black font-serif italic text-sm">Thành kính tưởng nhớ,</p>
               <p className="font-sans text-vnexpress font-bold tracking-[0.2em] uppercase text-[10px] opacity-80">Góc nhìn - VnExpress</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-vnexpress/40 via-gold/40 to-vnexpress/40"></div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 w-full flex items-center justify-between px-2 md:px-0">
            <div className="flex items-center space-x-3">
                 <button onClick={(e) => { e.stopPropagation(); handleShare('facebook'); }} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg">
                    <Facebook size={18} strokeWidth={1.5} />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleShare('x'); }} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg">
                    <XIcon size={16} />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleShare('copy'); }} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg">
                    {copied ? <Check size={18} className="text-green-400" /> : <LinkIcon size={18} strokeWidth={1.5} />}
                 </button>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              disabled={isDownloading}
              className="group flex items-center space-x-3 px-8 py-3.5 bg-vnexpress text-white rounded-full font-bold shadow-2xl hover:bg-vnexpress/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />}
              <span className="text-xs tracking-[0.2em] uppercase font-sans">TẢI THƯ</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
