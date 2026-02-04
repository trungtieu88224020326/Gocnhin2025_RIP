
export interface RawRow {
  [key: string]: string;
}

export interface Article {
  id: string;
  article_id?: string; // ID bài viết từ VnExpress
  author: string;
  author_name?: string;
  author_gen?: string; // Xưng hô (Ông/Bà)
  author_bio?: string; // Giới thiệu tác giả
  authorTitle?: string;
  avatar?: string;
  title: string;
  content: string;
  genre?: string;
  publishedDate?: string;
  views?: number;
  comments?: number;
  raw: RawRow;
}

export interface GroupedData {
  author: string;
  articles: Article[];
}

// Cập nhật URL mới nhất từ người dùng cung cấp
export const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy_E1FyKUWbt5gAwM3Qq7E49Jzfv5783n_Of_IJaBUieRpr-aaix4EYHFN05_9FncgSWpumFywo_PC/pub?gid=2017997582&single=true&output=tsv";
