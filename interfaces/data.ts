// interfaces/data.ts
// (Đây là nơi định nghĩa "hình dạng" dữ liệu của bạn)

export interface Song {
  id: string;
  title: string;
  artist: string;
  artwork?: any; // SỬA: Thêm '?' (optional)

  duration?: string;
  durationMillis?: number;
  plays?: string;
  audioUrl?: string;

  // ✅ MỚI: Thêm các key cho json-server
  artworkKey?: string;
  audioKey?: string;
}

export interface Chart {
  id: string;
  title: string;
  subtitle: string;
  artwork: any; // Đây là mảng màu gradient

  // ✅ MỚI: Key cho ảnh thật của chart
  imageKey?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: any; // SỬA: Thêm '?' (optional)

  // ✅ MỚI: Thêm key cho ảnh album
  artworkKey?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar?: any; // SỬA: Thêm '?' (optional)

  // ✅ MỚI: Thêm key cho ảnh đại diện
  avatarKey?: string;
}

export interface Playlist {
  id: string;
  title: string;
  artwork: any;
  songCount?: number;
  totalDuration?: string;
}
