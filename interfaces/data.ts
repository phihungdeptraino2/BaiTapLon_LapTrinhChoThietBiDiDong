// interfaces/data.ts
// (Đây là nơi định nghĩa "hình dạng" dữ liệu của bạn)

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  artwork: any; // Dùng 'any' vì require() trả về kiểu không xác định
}

export interface Chart {
  id: string;
  title: string;
  subtitle: string;
  artwork: any;
}
export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: any;
}


export interface Artist {
  id: string;
  name: string;
  avatar: any;
}