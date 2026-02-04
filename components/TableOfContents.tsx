
import React, { useState, useMemo } from 'react';
import { GroupedData, Article } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft, Search, X } from 'lucide-react';

interface Props {
  data: GroupedData[];
  currentArticleId: string | null;
  currentAuthorName?: string | null;
  onSelectArticle: (article: Article) => void;
  onSelectAuthor: (group: GroupedData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TableOfContents: React.FC<Props> = ({ data, currentArticleId, currentAuthorName, onSelectArticle, onSelectAuthor, isOpen, onClose }) => {
  const [expandedAuthors, setExpandedAuthors] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAuthor = (author: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAuthors(prev => ({
      ...prev,
      [author]: !prev[author]
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.map(group => {
      const filteredArticles = group.articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.author.toLowerCase().includes(query)
      );
      return { ...group, articles: filteredArticles };
    }).filter(group => group.articles.length > 0);
  }, [data, searchQuery]);

  React.useEffect(() => {
    if (currentArticleId) {
      for (const group of data) {
        if (group.articles.some(a => a.id === currentArticleId)) {
          setExpandedAuthors(prev => ({ ...prev, [group.author]: true }));
          break;
        }
      }
    }
  }, [currentArticleId, data]);

  return (
    <>
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out font-sans
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center shrink-0 z-10">
            <h2 className="text-[20px] font-bold font-serif text-vnexpress tracking-tight">Mục lục</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-ink transition-colors p-1"><ChevronLeft size={24} strokeWidth={1.5} /></button>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" placeholder="Tìm theo tác giả hoặc bài viết" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-vnexpress focus:border-vnexpress text-ink placeholder-gray-400"
                />
                 {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-1">
            {filteredData.map((group) => {
              const isSelected = currentAuthorName === group.author;

              return (
                <div key={group.author} className="mb-1">
                  <div
                    onClick={() => onSelectAuthor(group)}
                    className={`
                      w-full flex items-center justify-between p-2.5 rounded cursor-pointer transition-colors group
                      ${isSelected ? 'bg-vnexpress-light' : 'hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center text-ink font-bold group-hover:text-vnexpress transition-colors overflow-hidden">
                      <span className={`font-serif truncate ${isSelected ? 'text-vnexpress font-bold' : ''}`}>{group.author}</span>
                    </div>
                    <button 
                      onClick={(e) => toggleAuthor(group.author, e)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-vnexpress transition-all"
                    >
                      {expandedAuthors[group.author] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>

                  {expandedAuthors[group.author] && (
                    <div className="ml-2 mt-1 border-l border-gray-200 pl-2 space-y-1 animate-fade-in">
                      {group.articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => onSelectArticle(article)}
                          className={`
                            w-full text-left p-2 pl-3 text-sm rounded transition-all font-serif
                            ${currentArticleId === article.id 
                              ? 'bg-vnexpress-light text-vnexpress font-medium border-l-2 border-vnexpress' 
                              : 'text-sub-text hover:text-ink hover:bg-gray-50 border-l-2 border-transparent'}
                          `}
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-400 font-sans bg-gray-50">Tổng hợp {data.reduce((acc, g) => acc + g.articles.length, 0)} bài viết</div>
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />}
    </>
  );
};

export default TableOfContents;
