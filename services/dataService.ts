
import { Article, GroupedData, RawRow, SHEET_URL } from '../types';

/**
 * Fetches and parses the TSV data from the Google Sheet.
 */
export const fetchSheetData = async (): Promise<GroupedData[]> => {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const text = await response.text();
    return parseTSV(text);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return [];
  }
};

/**
 * Parses raw TSV text into structured data.
 */
const parseTSV = (tsvText: string): GroupedData[] => {
  const rows = tsvText.split(/\r?\n/).filter(row => row.trim() !== '');
  if (rows.length < 2) return [];

  const headers = rows[0].split('\t').map(h => h.trim().toLowerCase());
  const data: Article[] = [];

  const findCol = (keywords: string[]): number => {
    return headers.findIndex(h => 
      keywords.some(k => h === k.toLowerCase() || h.includes(k.toLowerCase()))
    );
  };

  // Column detection logic with improved matching for Vietnamese headers
  const authorIdx = findCol(['tác giả', 'author', 'người viết', 'họ và tên', 'họ tên', 'fullname']);
  const authorNameIdx = findCol(['author_name', 'tên đầy đủ', 'tên tác giả']);
  const authorGenIdx = findCol(['xưng hô', 'author_gen', 'gender', 'phái', 'giới tính', 'salutation']);
  const bioIdx = findCol(['giới thiệu', 'bio', 'author_bio', 'mô tả', 'tiểu sử', 'thông tin tác giả', 'về tác giả', 'author_info']);
  const jobIdx = findCol(['chức danh', 'nghề nghiệp', 'job', 'position', 'role', 'công việc', 'title', 'vị trí']);
  const titleIdx = findCol(['tên bài', 'title', 'tiêu đề', 'tác phẩm', 'bài viết', 'chủ đề']);
  const contentIdx = findCol(['nội dung', 'content', 'bài viết', 'chi tiết', 'bản thảo', 'body']);
  const genreIdx = findCol(['thể loại', 'genre', 'chuyên mục', 'loại', 'category']);
  const dateIdx = findCol(['ngày', 'date', 'thời gian', 'time', 'published', 'xuất bản']);
  const avatarIdx = findCol(['avatar', 'author_img', 'author_image', 'ảnh', 'hình ảnh', 'image', 'picture', 'photo', 'thumbnail', 'hình tác giả']);
  const articleIdIdx = findCol(['article_id', 'id bài', 'id bài viết', 'id article', 'object_id', 'id']);
  
  // New column detection for stats - Prioritize 'comment' as requested
  const commentsIdx = findCol(['comment', 'thảo luận', 'comments', 'bình luận', 'số thảo luận', 'số bình luận']);
  const viewsIdx = findCol(['view', 'lượt xem', 'views', 'số lượt xem', 'số view']);

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].split('\t');
    if (cells.length < 2) continue;

    const raw: RawRow = {};
    headers.forEach((h, idx) => {
      raw[h] = cells[idx]?.trim() || '';
    });

    const author = authorIdx !== -1 ? cells[authorIdx]?.trim() : (cells[1]?.trim() || 'Khuyết danh');
    const author_name = authorNameIdx !== -1 ? cells[authorNameIdx]?.trim() : undefined;
    const author_gen = authorGenIdx !== -1 ? cells[authorGenIdx]?.trim() : 'Ông/Bà';
    const author_bio = bioIdx !== -1 ? cells[bioIdx]?.trim() : undefined;
    const article_id = articleIdIdx !== -1 ? cells[articleIdIdx]?.trim() : undefined;
    
    let avatar = undefined;
    if (avatarIdx !== -1 && cells[avatarIdx]) {
      avatar = cells[avatarIdx]?.trim();
      if (avatar.startsWith('"') && avatar.endsWith('"')) {
        avatar = avatar.substring(1, avatar.length - 1);
      }
    }
    
    const title = titleIdx !== -1 ? cells[titleIdx]?.trim() : (cells[2]?.trim() || `Bài viết ${i}`);
    const content = contentIdx !== -1 ? cells[contentIdx]?.trim() : (cells[3]?.trim() || '');
    const genre = genreIdx !== -1 ? cells[genreIdx]?.trim() : undefined;
    const authorTitle = jobIdx !== -1 ? cells[jobIdx]?.trim() : undefined;
    
    let publishedDate = new Date().toLocaleDateString('vi-VN');
    if (dateIdx !== -1 && cells[dateIdx]) {
        const rawDate = cells[dateIdx].trim();
        publishedDate = rawDate.split(' ')[0];
    }

    // Parse numeric stats from sheet
    const parseNumber = (idx: number, fallback: number) => {
      if (idx === -1 || !cells[idx]) return fallback;
      // Remove all non-numeric characters except dots and commas (common in VN formatting)
      const cleaned = cells[idx].replace(/[^0-9,.]/g, '').replace(/[,.]/g, '').trim();
      const val = parseInt(cleaned);
      return isNaN(val) ? fallback : val;
    };

    const views = parseNumber(viewsIdx, 0);
    const comments = parseNumber(commentsIdx, 0);

    if (title || content) {
      data.push({
        id: `row-${i}`,
        article_id,
        author: author || 'Khuyết danh',
        author_name,
        author_gen,
        author_bio,
        authorTitle,
        avatar,
        title: title || 'Không tiêu đề',
        content,
        genre,
        publishedDate,
        views,
        comments,
        raw
      });
    }
  }

  const groups: Record<string, Article[]> = {};
  data.forEach(article => {
    const authorKey = article.author;
    if (!groups[authorKey]) {
      groups[authorKey] = [];
    }
    groups[authorKey].push(article);
  });

  return Object.keys(groups).sort().map(author => ({
    author,
    articles: groups[author].sort((a, b) => {
      const dateA = a.publishedDate ? new Date(a.publishedDate.split('/').reverse().join('-')).getTime() : 0;
      const dateB = b.publishedDate ? new Date(b.publishedDate.split('/').reverse().join('-')).getTime() : 0;
      if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
        return dateB - dateA;
      }
      return a.title.localeCompare(b.title);
    })
  }));
};
