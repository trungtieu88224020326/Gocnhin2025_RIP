
import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { GroupedData } from '../types';
import { User, Search, X, ChevronRight, BookOpen, Users, FileText } from 'lucide-react';

interface Props {
  data: GroupedData[];
  onSelectAuthor: (group: GroupedData) => void;
}

const AuthorList: React.FC<Props> = ({ data, onSelectAuthor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [searchQuery]);

  const filteredAuthors = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(group => 
      group.author.toLowerCase().includes(query) || 
      group.articles.some(a => (a.authorTitle?.toLowerCase() || '').includes(query))
    );
  }, [data, searchQuery]);

  const totalArticles = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.articles.length, 0);
  }, [data]);

  return (
    <div className="relative w-full h-full flex justify-center items-center p-4 lg:p-10 perspective-2000 bg-[#f7f7f7]">
      <div className="md:hidden w-full h-full bg-white flex flex-col shadow-xl rounded-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 bg-[#fafafa]">
          <h2 className="text-xl font-serif font-bold text-ink mb-2">Danh mục Tác giả</h2>
          <p className="text-[10px] uppercase tracking-widest text-sub-text font-bold mb-4 opacity-60">Tổng cộng {totalArticles} bài viết</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Nhập tên tác giả" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vnexpress/10 focus:border-vnexpress"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll px-4 py-2">
          {filteredAuthors.map((group) => {
            const avatar = group.articles.find(a => a.avatar)?.avatar;
            const authorTitle = group.articles.find(a => a.authorTitle)?.authorTitle;
            
            return (
              <div 
                key={group.author} 
                onClick={() => onSelectAuthor(group)}
                className="flex items-center py-4 border-b border-gray-50 active:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 mr-3 shrink-0">
                  {avatar ? (
                    <img src={avatar} alt={group.author} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"><User size={16} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-serif font-bold text-ink text-sm truncate">{group.author}</h4>
                  <p className="text-[10px] text-sub-text truncate opacity-70">{authorTitle}</p>
                </div>
                <div className="shrink-0 flex items-center space-x-2 mr-2">
                  <span className="text-[10px] font-bold text-vnexpress bg-vnexpress-light px-2 py-0.5 rounded-full">{group.articles.length} bài</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex relative w-full max-w-[1300px] h-[85vh] lg:h-[88vh] max-h-[850px] bg-white shadow-book rounded-sm flex flex-row transform-style-3d border border-border-gray overflow-hidden animate-fade-in">
        <div className="w-[40%] shrink-0 h-full bg-[#fafafa] relative border-r border-border-gray/60 flex flex-col items-center justify-center p-12 lg:p-20 text-center z-10">
           <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-300 z-30"></div>
           <div className="mb-10">
              <img src="https://s1.vnecdn.net/vnexpress/restruct/i/v9775/v2_2019/pc/graphics/logo.svg" alt="VnExpress" className="h-9 w-auto opacity-90" />
           </div>
           <div className="w-12 h-1 bg-vnexpress mb-12 rounded-full"></div>
           
           <h2 className="text-2xl lg:text-3xl font-serif font-bold text-vnexpress mb-4 tracking-tight">Góc nhìn 2025</h2>
           <p className="text-sm text-sub-text font-serif italic leading-relaxed opacity-70 max-w-xs mb-10">"Nơi hội tụ những góc nhìn sâu sắc, đa chiều từ những chuyên gia và học giả hàng đầu."</p>
           <div className="w-full pt-10 border-t border-gray-100 flex justify-around">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-sans font-black text-gray-300 tracking-[0.2em] mb-1">Tác giả</span>
                 <span className="text-3xl font-serif font-bold text-vnexpress">{data.length}</span>
              </div>
              <div className="w-px h-10 bg-gray-100 self-center"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-sans font-black text-gray-300 tracking-[0.2em] mb-1">Bài viết</span>
                 <span className="text-3xl font-serif font-bold text-vnexpress">{totalArticles}</span>
              </div>
           </div>
        </div>

        <div className="flex-1 h-full bg-white relative z-20 flex flex-col overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none z-30"></div>
           <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200 z-30"></div>
           <div className="px-12 lg:px-20 pt-16 pb-8 shrink-0">
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-6 h-[1px] bg-vnexpress"></div>
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-vnexpress">Tìm kiếm</h2>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-vnexpress transition-colors" size={20} />
                <input type="text" placeholder="Nhập tên tác giả" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-[#fcfcfc] border border-gray-100 rounded-xl text-lg font-serif focus:outline-none focus:ring-4 focus:ring-vnexpress/5 focus:border-vnexpress transition-all placeholder:text-gray-300" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-ink"><X size={18} /></button>}
              </div>
           </div>
           <div ref={listRef} className="flex-1 overflow-y-auto custom-scroll px-12 lg:px-20 pb-20">
              {filteredAuthors.length > 0 ? (
                <div className="divide-y divide-gray-50">
                   {filteredAuthors.map((group) => {
                      const avatar = group.articles.find(a => a.avatar)?.avatar;
                      const authorTitle = group.articles.find(a => a.authorTitle)?.authorTitle;

                      return (
                        <div key={group.author} onClick={() => onSelectAuthor(group)} className="group flex items-center py-6 cursor-pointer hover:bg-gray-50/50 -mx-6 px-6 rounded-xl transition-all duration-300">
                           <div className="shrink-0 mr-6">
                              <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white relative">
                                 {avatar ? (
                                   <img src={avatar} alt={group.author} className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"><User size={24} /></div>
                                 )}
                              </div>
                           </div>
                           <div className="flex-1 min-w-0 pr-6">
                              <h3 className="text-xl font-serif font-bold text-ink group-hover:text-vnexpress transition-colors truncate">{group.author}</h3>
                              {authorTitle && <p className="text-xs font-sans text-sub-text truncate opacity-60 mt-1">{authorTitle}</p>}
                           </div>
                           <div className="hidden lg:flex items-center space-x-10 mr-10">
                              <div className="text-right">
                                 <span className="block text-[9px] uppercase font-bold text-gray-300 tracking-wider">Bài viết</span>
                                 <span className="text-base font-serif font-bold text-ink group-hover:text-vnexpress transition-colors">{group.articles.length}</span>
                              </div>
                           </div>
                           <div className="shrink-0 text-gray-200 group-hover:text-vnexpress transition-all transform group-hover:translate-x-1"><ChevronRight size={24} strokeWidth={1.5} /></div>
                        </div>
                      );
                   })}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4"><Search size={32} /></div>
                   <h4 className="text-lg font-serif font-bold text-ink">Không tìm thấy kết quả</h4>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorList;
