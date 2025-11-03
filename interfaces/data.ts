// interfaces/data.ts
// (Đây là nơi định nghĩa "hình dạng" dữ liệu của bạn)

export interface Song {
  id: string;
  title: string;
  artist: string;
  artwork: any; // Dùng 'any' vì nó có thể là 'require()' hoặc { uri: '...' }
  
  // Sửa đổi/Thêm mới cho API
  duration?: string;          // Giữ lại (dù ta sẽ dùng durationMillis)
  durationMillis?: number;    // Dùng cho Player
  plays?: string;
  audioUrl?: string;          // 👈 Link MP3 thật
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
export interface Playlist {
  id: string;
  title: string;
  artwork: any;
  songCount?: number;
  totalDuration?: string;
}