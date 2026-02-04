
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Menu, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { fetchSheetData } from './services/dataService';
import { GroupedData, Article } from './types';
import TableOfContents from './components/TableOfContents';
import BookContent from './components/BookContent';
import CoverPage from './components/CoverPage';
import AuthorIntro from './components/AuthorIntro';
import AuthorList from './components/AuthorList';

const safePushState = (path: string) => {
  try {
    if (window.location.protocol === 'blob:') return;
    window.history.pushState({ path }, '', path);
  } catch (e) {
    console.warn("History pushState failed:", e);
  }
};

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

function App() {
  const [data, setData] = useState<GroupedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentAuthor, setCurrentAuthor] = useState<GroupedData | null>(null);
  const [showCover, setShowCover] = useState(true);
  const [showAuthorList, setShowAuthorList] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const groupedData = await fetchSheetData();
      setData(groupedData);
      setLoading(false);
    };
    loadData();
  }, []);

  const flatArticleList = useMemo(() => {
    return data.flatMap(g => g.articles);
  }, [data]);

  // Handle URL Routing
  useEffect(() => {
    if (loading || data.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const authorParam = params.get('author');
    const isAuthorsPage = params.get('view') === 'authors';

    if (articleId) {
      const found = flatArticleList.find(a => a.id === articleId);
      if (found) {
        setCurrentArticle(found);
        setCurrentAuthor(null);
        setShowAuthorList(false);
        setShowCover(false);
        return;
      }
    }

    if (authorParam) {
      // Find author by slug
      let group = data.find(g => toSlug(g.author) === authorParam);
      
      // Fallback: try decoding in case of legacy URL (e.g. %20)
      if (!group) {
        try {
          const decoded = decodeURIComponent(authorParam).toLowerCase();
          group = data.find(g => g.author.toLowerCase() === decoded);
        } catch (e) {}
      }

      if (group) {
        setCurrentAuthor(group);
        setCurrentArticle(null);
        setShowAuthorList(false);
        setShowCover(false);
        return;
      }
    }

    if (isAuthorsPage) {
      setShowAuthorList(true);
      setShowCover(false);
      setCurrentArticle(null);
      setCurrentAuthor(null);
    }
  }, [loading, data, flatArticleList]);

  // Responsive logic
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActuallyMobile = windowWidth < 768;

  useEffect(() => {
    if (!isActuallyMobile && !showCover && !showAuthorList) {
      setIsMenuOpen(true);
    }
  }, [showCover, showAuthorList, isActuallyMobile]);

  const handleArticleSelect = useCallback((article: Article) => {
    setCurrentArticle(article);
    setCurrentAuthor(null);
    setShowAuthorList(false);
    setShowCover(false);
    const newUrl = `${window.location.pathname}?id=${article.id}`;
    safePushState(newUrl);
    if (isActuallyMobile) {
      setIsMenuOpen(false);
    }
  }, [isActuallyMobile]);

  const handleAuthorSelect = useCallback((group: GroupedData) => {
    setCurrentAuthor(group);
    setCurrentArticle(null);
    setShowAuthorList(false);
    setShowCover(false);
    // Use slug for URL
    const newUrl = `${window.location.pathname}?author=${toSlug(group.author)}`;
    safePushState(newUrl);
    if (isActuallyMobile) {
      setIsMenuOpen(false);
    }
  }, [isActuallyMobile]);

  const handleAuthorClickByName = useCallback((name: string) => {
    const group = data.find(g => g.author === name);
    if (group) {
      handleAuthorSelect(group);
    }
  }, [data, handleAuthorSelect]);

  const handleOpenCover = () => {
    setShowAuthorList(true);
    setShowCover(false);
    safePushState(`${window.location.pathname}?view=authors`);
  };

  const handleBackToAuthors = useCallback(() => {
    setCurrentAuthor(null);
    setCurrentArticle(null);
    setShowAuthorList(true);
    safePushState(`${window.location.pathname}?view=authors`);
  }, []);

  const handleGoHome = () => {
    setShowCover(true);
    setCurrentArticle(null);
    setCurrentAuthor(null);
    setShowAuthorList(false);
    safePushState(window.location.pathname);
    if (isActuallyMobile) {
      setIsMenuOpen(false);
    }
  };

  const currentIndex = useMemo(() => {
    if (!currentArticle) return -1;
    return flatArticleList.findIndex(a => a.id === currentArticle.id);
  }, [currentArticle, flatArticleList]);

  const goToNext = () => {
    if (currentIndex < flatArticleList.length - 1) {
      handleArticleSelect(flatArticleList[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      handleArticleSelect(flatArticleList[currentIndex - 1]);
    }
  };

  // Aggregated stats for the author
  const authorStats = useMemo(() => {
    const targetAuthor = currentArticle ? currentArticle.author : currentAuthor?.author;
    if (!targetAuthor || !data) return { views: 0, comments: 0 };
    
    const authorGroup = data.find(g => g.author === targetAuthor);
    if (!authorGroup) return { views: 0, comments: 0 };
    
    return authorGroup.articles.reduce((acc, curr) => ({
      views: acc.views + (curr.views || 0),
      comments: acc.comments + (curr.comments || 0)
    }), { views: 0, comments: 0 });
  }, [currentArticle, currentAuthor, data]);

  const currentAuthorGroup = useMemo(() => {
    if (!currentArticle) return null;
    return data.find(g => g.author === currentArticle.author) || null;
  }, [currentArticle, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-vnexpress">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h1 className="text-xl font-serif text-ink">Đang tải 2025...</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f7f7f7] flex flex-col font-sans">
      <nav className="h-16 bg-white border-b border-border-gray flex items-center justify-between px-4 z-40 shadow-sm text-ink shrink-0">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-gray-100 text-vnexpress' : 'hover:bg-gray-100 text-sub-text'}`}
            title="Mục lục"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center">
            <a 
              href="https://vnexpress.net/goc-nhin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-70 transition-opacity font-serif font-bold text-vnexpress text-base md:text-lg"
            >
              Góc nhìn
            </a>
            <div className="mx-2 md:mx-3 h-4 w-px bg-gray-200"></div>
            <button 
              onClick={handleGoHome} 
              className="font-serif font-bold text-vnexpress text-lg md:text-xl hover:opacity-70 transition-all whitespace-nowrap tracking-tight"
            >
              2025
            </button>
          </div>
        </div>

        {!showCover && !showAuthorList && (
          <div className="flex items-center space-x-1">
             <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="p-1 hover:bg-white hover:text-vnexpress rounded-full text-sub-text">
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] font-bold w-4 text-center text-sub-text">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-1 hover:bg-white hover:text-vnexpress rounded-full text-sub-text">
                  <ZoomIn size={14} />
                </button>
             </div>
          </div>
        )}

        {showAuthorList && (
          <button onClick={handleGoHome} className="text-[11px] font-bold text-sub-text hover:text-vnexpress transition-colors uppercase tracking-widest px-4">
            Trang bìa
          </button>
        )}
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <TableOfContents 
          data={data} 
          currentArticleId={currentArticle?.id || null}
          currentAuthorName={currentAuthor?.author || null}
          onSelectArticle={handleArticleSelect}
          onSelectAuthor={handleAuthorSelect}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <main className={`flex-1 relative transition-all duration-300 ease-in-out bg-[#f7f7f7] flex flex-col overflow-hidden ${isMenuOpen && !isActuallyMobile ? 'md:ml-80' : 'ml-0'}`}>
          {showCover ? (
             <CoverPage onOpen={handleOpenCover} title="Góc nhìn" subtitle="Thế giới không thiếu thông tin, chỉ thiếu những góc nhìn minh triết" />
          ) : showAuthorList ? (
             <AuthorList data={data} onSelectAuthor={handleAuthorSelect} />
          ) : currentAuthor ? (
             <AuthorIntro group={currentAuthor} onSelectArticle={handleArticleSelect} onBackToAuthors={handleBackToAuthors} authorStats={authorStats} />
          ) : currentArticle ? (
              <>
                <div className="flex-1 overflow-hidden relative">
                  <BookContent 
                    key={currentArticle.id}
                    article={currentArticle} 
                    fontSize={fontSize} 
                    authorTotalViews={authorStats.views}
                    authorTotalComments={authorStats.comments}
                    onAuthorClick={handleAuthorClickByName}
                    authorGroup={currentAuthorGroup}
                    onSelectArticle={handleArticleSelect}
                    onBackToAuthors={handleBackToAuthors}
                  />
                </div>

                {!isActuallyMobile && (
                  <>
                    <button onClick={goToPrev} disabled={currentIndex <= 0} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white text-sub-text border border-border-gray rounded-full shadow-lg hover:text-vnexpress hover:border-vnexpress transition-all disabled:opacity-0 disabled:pointer-events-none z-30">
                      <ChevronLeft size={28} />
                    </button>
                    <button onClick={goToNext} disabled={currentIndex >= flatArticleList.length - 1} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white text-sub-text border border-border-gray rounded-full shadow-lg hover:text-vnexpress hover:border-vnexpress transition-all disabled:opacity-0 disabled:pointer-events-none z-30">
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
                
                {isActuallyMobile && (
                  <div className="h-[52px] bg-white border-t border-gray-100 flex items-center justify-between px-8 z-50 shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.03)]">
                     <button onClick={goToPrev} disabled={currentIndex <= 0} className="flex items-center space-x-1 transition-colors text-[#cfcfcf] disabled:opacity-30">
                       <ChevronLeft size={18} strokeWidth={2.5} />
                       <span className="text-[14px] font-medium">Trước</span>
                     </button>
                     <div className="bg-[#f2f4f7] px-5 py-1.5 rounded-full flex justify-center items-center min-w-[80px]">
                       <span className="text-[13px] text-[#758195] font-sans font-bold">{currentIndex + 1} / {flatArticleList.length}</span>
                     </div>
                     <button onClick={goToNext} disabled={currentIndex >= flatArticleList.length - 1} className="flex items-center space-x-1 transition-colors text-[#9f224e] disabled:opacity-30">
                       <span className="text-[14px] font-medium">Sau</span>
                       <ChevronRight size={18} strokeWidth={2.5} />
                     </button>
                  </div>
                )}
              </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;
