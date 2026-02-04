import React, { useRef, useLayoutEffect, useState } from 'react';
import { Article, GroupedData } from '../types';
import { Clock, MessageSquare, ChevronRight, Facebook, Link as LinkIcon, Check, User, ArrowLeft, Gift } from 'lucide-react';
import GreetingCard from './GreetingCard';

interface Props {
  article: Article;
  fontSize: number;
  authorTotalViews?: number;
  authorTotalComments?: number;
  onAuthorClick?: (authorName: string) => void;
  authorGroup?: GroupedData | null;
  onSelectArticle?: (article: Article) => void;
  onBackToAuthors?: () => void;
}

// Chuyển đổi tiếng Việt sang slug (không dấu, gạch ngang)
const toSlug = (str: string) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[^a-z0-9 ]/g, "");
  str = str.replace(/\s+/g, "-");
  str = str.replace(/-+/g, "-");
  return str;
};

const BookContent: React.FC<Props> = ({ 
  article, 
  fontSize, 
  authorTotalViews = 0, 
  authorTotalComments = 0, 
  onAuthorClick,
  authorGroup,
  onSelectArticle,
  onBackToAuthors
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPageRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useLayoutEffect(() => {
    const resetScroll = () => {
      if (containerRef.current) containerRef.current.scrollTop = 0;
      if (leftPageRef.current) leftPageRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    resetScroll();
    const timer = setTimeout(resetScroll, 0);
    const raf = requestAnimationFrame(resetScroll);

    setCopied(false);
    setShowCard(false);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [article.id]);

  const processedContent = React.useMemo(() => {
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(article.content);
    if (hasHtmlTags) {
      return article.content;
    }
    return article.content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<p>${line}</p>`)
      .join('');
  }, [article.content]);

  // Tạo link thảo luận VnExpress với anchor bình luận
  const vnExpressUrl = React.useMemo(() => {
    if (!article.article_id) return null;
    const slug = toSlug(article.title);
    return `https://vnexpress.net/${slug}-${article.article_id}.html#box_comment_vne`;
  }, [article.title, article.article_id]);

  const shareUrl = window.location.href;
  const shareTitle = `${article.title} - ${article.author}`;

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

  const DiscussionBadge = ({ isMobile = false }) => {
    const content = (
      <>
        <MessageSquare size={14} className={isMobile ? "text-gray-300" : "text-gray-400"} />
        <span className={vnExpressUrl ? "underline decoration-dotted underline-offset-4" : ""}>
          {article.comments?.toLocaleString()} thảo luận
        </span>
      </>
    );

    if (vnExpressUrl) {
      return (
        <a 
          href={vnExpressUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-1.5 whitespace-nowrap hover:text-vnexpress transition-colors"
          title="Mở phần thảo luận trên VnExpress"
        >
          {content}
        </a>
      );
    }

    return (
      <div className="flex items-center space-x-1.5 whitespace-nowrap">
        {content}
      </div>
    );
  };

  // Custom X Icon (Brand X)
  const XIcon = ({ size = 24, className = "" }) => (
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

  const AuthorHeader = ({ isMobile = false }) => (
    <button 
      onClick={() => onAuthorClick?.(article.author)}
      className={`flex items-center space-x-3 mb-6 text-left group/author-header transition-opacity hover:opacity-80`}
    >
      <div className="shrink-0">
        {article.avatar ? (
          <img 
            src={article.avatar} 
            alt={article.author} 
            className={`${isMobile ? 'w-10 h-10' : 'w-11 h-11'} rounded-full object-cover border border-gray-100 shadow-sm bg-white`}
          />
        ) : (
          <div className={`${isMobile ? 'w-10 h-10' : 'w-11 h-11'} bg-gray-50 rounded-full flex items-center justify-center border border-gray-100`}>
            <User size={isMobile ? 18 : 20} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h4 className="font-serif font-bold text-ink leading-tight truncate group-hover/author-header:text-vnexpress transition-colors">
          {article.author}
        </h4>
        {article.authorTitle && (
          <p className="text-[11px] lg:text-[12px] text-sub-text font-sans mt-0.5 truncate tracking-wide opacity-70">
            {article.authorTitle}
          </p>
        )}
      </div>
    </button>
  );

  return (
    <>
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto custom-scroll bg-[#f7f7f7]"
      >
        {/* Mobile View Layout */}
        <div className="md:hidden w-full flex flex-col bg-white min-h-full relative">
            {onBackToAuthors && (
              <button 
                onClick={onBackToAuthors}
                className="absolute left-4 top-4 p-2 text-sub-text hover:text-vnexpress transition-colors z-30"
                title="Quay lại danh sách tác giả"
              >
                <ArrowLeft size={22} />
              </button>
            )}

            <div className="bg-[#fafafa]/50 border-b border-gray-100 flex flex-col items-center py-4 px-6">
                <div className="w-10 h-1 bg-vnexpress/10 rounded-full"></div>
            </div>

            <div className="flex-1 px-6 py-10 bg-white">
               <div className="flex justify-between items-start mb-6">
                  <AuthorHeader isMobile={true} />
                  <button onClick={() => setShowCard(true)} className="flex items-center space-x-2 px-3 py-1.5 bg-vnexpress/10 text-vnexpress rounded-full text-[10px] font-sans font-bold transition-all active:scale-95 border border-vnexpress/20">
                    <Gift size={12} />
                    <span className="uppercase tracking-widest">Tưởng nhớ</span>
                  </button>
               </div>
               
               <h1 className="text-2xl font-serif font-bold text-ink leading-[1.4] mb-4">
                  {article.title}
               </h1>
               
               <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sub-text text-[11px] font-sans">
                     <div className="flex items-center space-x-1.5 whitespace-nowrap">
                         <Clock size={14} className="text-gray-300" />
                         <span>{article.publishedDate?.split(' ')[0]}</span>
                     </div>
                     <DiscussionBadge isMobile={true} />
                  </div>
                  
                  <div className="flex items-center space-x-4 shrink-0">
                      <button onClick={handleShareFacebook} className="text-[#a8a8a8] hover:text-blue-600 transition-colors">
                          <Facebook size={18} strokeWidth={1.2} />
                      </button>
                      <button onClick={handleShareX} className="text-[#a8a8a8] hover:text-black transition-colors">
                          <XIcon size={14} />
                      </button>
                      <button onClick={handleCopyLink} className="text-[#a8a8a8] hover:text-vnexpress transition-colors">
                          {copied ? <Check size={18} className="text-green-600"/> : <LinkIcon size={18} strokeWidth={1.2} />}
                      </button>
                  </div>
               </div>

               <div className="h-px w-full bg-gray-100 mb-8"></div>
               <div 
                  className="prose prose-stone prose-lg max-w-none font-serif text-ink text-justify leading-[1.85] tracking-normal"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
               />
            </div>
        </div>

        {/* Desktop View Layout */}
        <div className="hidden md:flex relative w-full h-full justify-center items-center p-6 lg:p-10 perspective-2000 overflow-hidden">
          <div className="relative w-full max-w-[1400px] h-[85vh] lg:h-[90vh] max-h-[900px] bg-white shadow-book rounded-sm flex flex-row transform-style-3d border border-border-gray overflow-hidden">
            
            <div className="w-[42%] lg:w-[40%] shrink-0 h-full bg-[#fcfcfc] relative border-r border-border-gray/60 flex flex-col z-10">
               <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-300 z-30"></div>
               
               {onBackToAuthors && (
                 <button 
                   onClick={onBackToAuthors}
                   className="absolute left-8 top-8 flex items-center space-x-2 text-[10px] font-bold text-gray-400 hover:text-vnexpress transition-all group/back z-30"
                 >
                   <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                   <span className="uppercase tracking-widest">Danh sách tác giả</span>
                 </button>
               )}

               <div ref={leftPageRef} className="flex-1 overflow-y-auto custom-scroll px-10 lg:px-14 py-20 lg:py-24">
                  <div className="mb-10">
                     <div className="flex items-center space-x-3 mb-4">
                        <div className="w-6 h-[1px] bg-vnexpress"></div>
                        <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-vnexpress">Danh mục</h2>
                     </div>
                     <h3 className="text-2xl lg:text-3xl font-serif font-bold text-ink leading-tight tracking-tight">Bài viết tiêu biểu</h3>
                  </div>

                  <div className="space-y-0">
                     {authorGroup?.articles.map((item, idx) => (
                        <div 
                          key={item.id}
                          onClick={() => onSelectArticle?.(item)}
                          className={`
                            group cursor-pointer flex items-center justify-between py-3 border-b border-gray-100 hover:bg-white hover:px-4 -mx-4 rounded-lg transition-all duration-300
                            ${article.id === item.id ? 'bg-vnexpress-light px-4 border-vnexpress/20' : ''}
                          `}
                        >
                           <div className="flex items-baseline space-x-4">
                              <span className={`font-sans font-bold text-base lg:text-lg transition-colors w-7 ${article.id === item.id ? 'text-vnexpress' : 'text-gray-300 group-hover:text-vnexpress/40'}`}>
                                 {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                 <h4 className={`font-serif font-bold text-base lg:text-lg transition-all duration-300 mb-0.5 leading-tight truncate ${article.id === item.id ? 'text-vnexpress' : 'text-ink group-hover:text-vnexpress'}`}>
                                    {item.title}
                                 </h4>
                                 <div className="flex items-center space-x-3 text-sub-text text-[10px] uppercase font-bold tracking-widest opacity-50">
                                    <span>{item.publishedDate?.split(' ')[0]}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={`shrink-0 ml-2 ${article.id === item.id ? 'text-vnexpress' : 'text-gray-200 group-hover:text-vnexpress transition-colors'}`}>
                              <ChevronRight size={18} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div key={article.id + '-content-pc'} className="flex-1 h-full bg-white relative z-20 origin-left animate-page-turn flex flex-col">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-200/40 via-gray-100/10 to-transparent pointer-events-none z-30"></div>
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-300 z-30"></div>
              <div className="flex-1 overflow-y-auto custom-scroll px-10 lg:px-20 py-12 lg:py-16">
                <div className="flex justify-between items-start">
                   <AuthorHeader isMobile={false} />
                   <button onClick={() => setShowCard(true)} className="flex items-center space-x-2 px-6 py-2 bg-vnexpress text-white rounded-full text-[11px] font-sans font-bold transition-all shadow-md hover:bg-vnexpress/90 active:scale-95">
                      <Gift size={16} />
                      <span className="uppercase tracking-widest">THƯ TƯỞNG NHỚ</span>
                    </button>
                </div>
                
                <h1 className="text-2xl lg:text-3xl xl:text-[2rem] font-serif font-bold text-ink leading-[1.3] mb-6">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sub-text text-xs lg:text-sm font-sans mb-10 border-b border-gray-100 pb-6">
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                      <Clock size={14} className="text-gray-400" />
                      <span className="font-medium">{article.publishedDate?.split(' ')[0]}</span>
                  </div>
                  <DiscussionBadge isMobile={false} />
                  <div className="ml-auto flex items-center space-x-3">
                    <button onClick={handleShareFacebook} className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={16}/></button>
                    <button onClick={handleShareX} className="text-gray-400 hover:text-black transition-colors"><XIcon size={14}/></button>
                    <button onClick={handleCopyLink} className="text-gray-400 hover:text-vnexpress transition-colors">
                      {copied ? <Check size={16} className="text-green-600"/> : <LinkIcon size={16}/>}
                    </button>
                  </div>
                </div>
                <div 
                    className="prose prose-stone prose-lg max-w-none font-serif text-ink text-justify leading-relaxed lg:leading-[2] tracking-normal"
                    style={{ fontSize: `${fontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              </div>
              <div className="p-6 text-right text-[10px] lg:text-xs text-gray-300 font-sans tracking-[0.2em] uppercase">
                Góc nhìn VnExpress
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCard && (
        <GreetingCard 
          author={article.author}
          authorGen={article.author_gen || 'Tác giả'}
          avatar={article.avatar}
          totalViews={authorTotalViews}
          totalComments={authorTotalComments}
          onClose={() => setShowCard(false)} 
        />
      )}
    </>
  );
};

export default BookContent;
