
import React, { useState, useMemo } from 'react';
import { GroupedData, Article } from '../types';
import { User, ChevronRight, Gift, Facebook, Link as LinkIcon, Check, ArrowLeft } from 'lucide-react';
import GreetingCard from './GreetingCard';

interface Props {
  group: GroupedData;
  onSelectArticle: (article: Article) => void;
  onBackToAuthors: () => void;
  authorStats: { views: number; comments: number };
}

const AuthorIntro: React.FC<Props> = ({ group, onSelectArticle, onBackToAuthors, authorStats }) => {
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Robust data extraction: find first non-empty values across all articles of the author
  const avatar = useMemo(() => group.articles.find(a => a.avatar)?.avatar, [group.articles]);
  const authorTitle = useMemo(() => group.articles.find(a => a.authorTitle)?.authorTitle, [group.articles]);
  const authorBio = useMemo(() => group.articles.find(a => a.author_bio)?.author_bio, [group.articles]);
  const authorGen = useMemo(() => group.articles.find(a => a.author_gen)?.author_gen || 'Ông/Bà', [group.articles]);

  const shareUrl = window.location.href;
  const shareTitle = `Hồ sơ tác giả: ${group.author} - VnExpress Góc nhìn`;

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processedBio = useMemo(() => {
    if (!authorBio) return "";
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(authorBio);
    if (hasHtmlTags) return authorBio;
    return authorBio
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<p>${line}</p>`)
      .join('');
  }, [authorBio]);

  const XIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
  );

  return (
    <div className="relative w-full h-full overflow-y-auto md:overflow-hidden bg-[#fafafa]">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col bg-white min-h-full">
         <div className="px-6 pt-6 pb-2">
            <button onClick={onBackToAuthors} className="p-2 -ml-2 text-sub-text hover:text-vnexpress transition-colors">
              <ArrowLeft size={24} />
            </button>
         </div>
         <div className="px-8 pb-8 flex flex-col">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 shrink-0 relative">
                {avatar ? (
                  <img src={avatar} alt={group.author} className="w-full h-full rounded-full object-cover border border-gray-100 shadow-md" />
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center border border-gray-100"><User size={24} className="text-gray-200" /></div>
                )}
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-xl font-serif font-bold text-vnexpress leading-tight truncate">{group.author}</h1>
                {authorTitle && <p className="text-sub-text text-[12px] font-sans mt-0.5 truncate opacity-70">{authorTitle}</p>}
              </div>
            </div>
            {authorBio ? (
              <div className="mb-6 px-1">
                <div className="text-[13px] text-stone-600 font-serif leading-relaxed italic border-l-2 border-gray-100 pl-4 bio-content" dangerouslySetInnerHTML={{ __html: processedBio }} />
              </div>
            ) : (
              <div className="mb-6 px-1 italic text-gray-400 text-xs">Thông tin tác giả đang được cập nhật...</div>
            )}
            <div className="flex items-center space-x-3 mb-8">
               <button onClick={() => setShowCard(true)} className="flex items-center justify-center space-x-2 px-6 py-2 bg-vnexpress text-white rounded-full text-[10px] font-sans font-bold transition-all shadow-md active:scale-95">
                  <Gift size={14} />
                  <span className="uppercase tracking-widest">THIỆP CẢM ƠN</span>
               </button>
               <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
                  <button onClick={handleShareFacebook} className="text-gray-300 active:text-blue-600 transition-colors"><Facebook size={18} strokeWidth={1.5} /></button>
                  <button onClick={handleShareX} className="text-gray-300 active:text-black transition-colors"><XIcon size={16} /></button>
                  <button onClick={handleCopyLink} className="text-gray-300 active:text-vnexpress transition-colors">
                      {copied ? <Check size={18} className="text-green-600"/> : <LinkIcon size={18} strokeWidth={1.5} />}
                  </button>
               </div>
            </div>
            <div className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="text-center">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Bài viết</span>
                  <span className="text-lg font-serif font-bold text-ink">{group.articles.length}</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="text-center">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Thảo luận</span>
                  <span className="text-lg font-serif font-bold text-ink">{authorStats.comments.toLocaleString()}</span>
               </div>
            </div>
         </div>
         <div className="px-6 py-8 bg-[#f9f9f9] rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.02)] border-t border-gray-100 flex-1">
            <h3 className="font-serif font-bold text-lg text-ink mb-6 px-2">Danh sách bài viết</h3>
            <div className="space-y-3 pb-10">
               {group.articles.map((article) => (
                 <div key={article.id} onClick={() => onSelectArticle(article)} className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-gray-50 hover:border-vnexpress/30 transition-all group active:scale-[0.98] cursor-pointer">
                    <div className="flex-1 min-w-0">
                       <h4 className="font-serif font-bold text-ink leading-snug group-hover:text-vnexpress transition-colors truncate">{article.title}</h4>
                       <div className="flex items-center text-[10px] text-sub-text mt-1 space-x-3 uppercase font-bold tracking-wider opacity-60">
                          <span>{article.publishedDate?.split(' ')[0]}</span>
                          <span>•</span>
                          <span>{article.comments} thảo luận</span>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-vnexpress transition-colors" />
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Desktop Book View */}
      <div className="hidden md:flex relative w-full h-full justify-center items-center p-6 lg:p-10 perspective-2000">
         <div className="relative w-full max-w-[1300px] h-[85vh] lg:h-[88vh] max-h-[850px] bg-white shadow-book rounded-sm flex flex-row transform-style-3d border border-border-gray overflow-hidden">
            {/* Left Page: Author Profile */}
            <div className="w-[45%] shrink-0 h-full bg-white relative border-r border-border-gray/60 flex flex-col p-12 lg:p-16 z-10">
               <button onClick={onBackToAuthors} className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 hover:text-vnexpress transition-all group/back mb-12">
                 <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                 <span className="uppercase tracking-widest">Danh sách tác giả</span>
               </button>
               <div className="animate-fade-in flex flex-col w-full flex-1 overflow-y-auto custom-scroll pr-2">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={group.author} className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border border-gray-100 shadow-xl" />
                      ) : (
                        <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-lg"><User size={40} className="text-gray-100" /></div>
                      )}
                    </div>
                    <div className="flex flex-col pt-2 min-w-0">
                      <h1 className="text-2xl lg:text-3xl font-serif font-bold text-vnexpress mb-1 tracking-tight leading-tight">{group.author}</h1>
                      {authorTitle && <p className="text-sm lg:text-base text-sub-text font-sans opacity-60">{authorTitle}</p>}
                    </div>
                  </div>
                  {authorBio ? (
                    <div className="mb-10">
                      <div className="text-sm lg:text-base text-stone-600 font-serif italic leading-relaxed border-l-2 border-gray-100 pl-6 py-1 bio-content" dangerouslySetInnerHTML={{ __html: processedBio }} />
                    </div>
                  ) : (
                    <div className="mb-10 italic text-gray-400 text-sm">Thông tin tác giả đang được cập nhật...</div>
                  )}
                  <div className="flex items-center space-x-4 mb-10">
                    <button onClick={() => setShowCard(true)} className="flex items-center space-x-2 px-8 py-2.5 bg-vnexpress text-white rounded-full text-[11px] font-sans font-bold transition-all shadow-md hover:bg-vnexpress/90 active:scale-95">
                      <Gift size={16} />
                      <span className="uppercase tracking-widest">THIỆP CẢM ƠN</span>
                    </button>
                    <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
                      <button onClick={handleShareFacebook} className="text-gray-300 hover:text-blue-600 transition-colors" title="Chia sẻ Facebook"><Facebook size={18} strokeWidth={1.2} /></button>
                      <button onClick={handleShareX} className="text-gray-300 hover:text-black transition-colors" title="Chia sẻ trên X"><XIcon size={16} /></button>
                      <button onClick={handleCopyLink} className="text-gray-300 hover:text-vnexpress transition-colors" title="Sao chép liên kết">
                        {copied ? <Check size={18} className="text-green-600"/> : <LinkIcon size={18} strokeWidth={1.2} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full py-8 border-y border-gray-50 mb-10">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-sans font-black text-gray-300 tracking-[0.2em] mb-1">Số bài viết</span>
                        <span className="text-3xl font-serif font-bold text-ink">{group.articles.length}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-sans font-black text-gray-300 tracking-[0.2em] mb-1">Thảo luận</span>
                        <span className="text-3xl font-serif font-bold text-ink">{authorStats.comments.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
            {/* Right Page: Article List */}
            <div className="flex-1 h-full bg-[#fcfcfc] relative z-20 flex flex-col overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none z-30"></div>
               <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200 z-30"></div>
               <div className="flex-1 overflow-y-auto custom-scroll px-16 lg:px-20 py-20">
                  <div className="mb-14">
                     <div className="flex items-center space-x-3 mb-4">
                        <div className="w-6 h-[1px] bg-vnexpress"></div>
                        <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-vnexpress">Danh mục</h2>
                     </div>
                     <h3 className="text-3xl lg:text-[2.5rem] font-serif font-bold text-ink leading-tight tracking-tight">Bài viết năm 2025</h3>
                  </div>
                  <div className="space-y-0">
                     {group.articles.map((article, idx) => (
                        <div key={article.id} onClick={() => onSelectArticle(article)} className="group cursor-pointer flex items-center justify-between py-3.5 border-b border-gray-100 hover:bg-white hover:px-6 -mx-6 rounded-lg transition-all duration-300">
                           <div className="flex items-baseline space-x-6">
                              <span className="font-sans font-bold text-gray-200 text-xl lg:text-2xl group-hover:text-vnexpress/30 transition-colors w-10">{idx + 1}</span>
                              <div className="flex-1">
                                 <h4 className="font-serif font-bold text-lg lg:text-xl text-ink group-hover:text-vnexpress transition-all duration-300 mb-0.5 leading-tight">{article.title}</h4>
                                 <div className="flex items-center space-x-4 text-sub-text text-[10px] uppercase font-bold tracking-widest opacity-50">
                                    <span>{article.publishedDate?.split(' ')[0]}</span>
                                    <span>•</span>
                                    <span>{article.comments?.toLocaleString()} thảo luận</span>
                                 </div>
                              </div>
                           </div>
                           <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-200 group-hover:text-vnexpress group-hover:border-vnexpress transition-all transform group-hover:translate-x-1">
                              <ChevronRight size={20} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="p-8 text-right text-[9px] text-gray-300 font-sans tracking-[0.3em] uppercase">Hồ sơ Tác giả / 2025</div>
            </div>
         </div>
      </div>
      {showCard && (
        <GreetingCard author={group.author} authorGen={authorGen} avatar={avatar} totalViews={authorStats.views} totalComments={authorStats.comments} onClose={() => setShowCard(false)} />
      )}
    </div>
  );
};

export default AuthorIntro;
