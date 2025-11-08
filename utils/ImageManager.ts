// utils/ImageManager.ts

/**
 * ⚠️ QUAN TRỌNG
 * Tạo một file ảnh bất kỳ (ví dụ 100x100, màu xám)
 * và lưu nó với tên là 'placeholder.png' trong thư mục '/assets'
 * để làm ảnh dự phòng.
 */
const placeholder = require("../assets/Feed - Audio Listing/Image 93.png"); // 👈 BẮT BUỘC

export const AppImages = {
  // --- Home Screen ---
  avatar_3: require("../assets/Home - Audio Listing/Avatar 3.png"),
   avatar_4: require("../assets/Home - Audio Listing/bieber-coverstory-square (1).jpg"),

  suggestion_26: require("../assets/Home - Audio Listing/Container 26.png"),
  suggestion_27: require("../assets/Home - Audio Listing/Container 27.png"),
  suggestion_28: require("../assets/Home - Audio Listing/Picture10.jpg"),
  chart_31: require("../assets/Home - Audio Listing/Container 31.png"),
  chart_32: require("../assets/Home - Audio Listing/Container 32.png"),
  chart_33: require("../assets/Home - Audio Listing/Container 33.png"),

  album_45: require("../assets/Home - Audio Listing/Image 45.png"),
  album_46: require("../assets/Home - Audio Listing/Image 46.png"),
  artist_39: require("../assets/Home - Audio Listing/Image 39.png"),
  artist_40: require("../assets/Home - Audio Listing/Image 40.png"),
  artist_41: require("../assets/Home - Audio Listing/Image 41.png"),

  // --- Playlist/Artist (Chung) ---
  song_47: require("../assets/Home - Audio Listing/Image 47.png"), // Dùng ở cả 2
  song_40: require("../assets/Home - Audio Listing/Image 40.png"), // Trùng với artist_40

  // --- Artist Screen ---
  song_50: require("../assets/Playlist Details - Audio Listing/Image 50.png"),
  song_51: require("../assets/Playlist Details - Audio Listing/Image 51.png"),
  song_52: require("../assets/Playlist Details - Audio Listing/Image 52.png"),
  song_54: require("../assets/Playlist Details - Audio Listing/Image 54.png"),
  song_55: require("../assets/Playlist Details - Audio Listing/Image 55.png"),

  artist_album_71: require("../assets/Artist Profile/Image 71.png"),
  artist_album_72: require("../assets/Artist Profile/Image 72.png"),
  artist_album_73: require("../assets/Artist Profile/Image 73.png"),

  fans_74: require("../assets/Artist Profile/Image 74.png"),
  fans_75: require("../assets/Artist Profile/Image 75.png"),
  fans_76: require("../assets/Artist Profile/Image 76.png"),

  // --- Search Screen (Mock cũ) ---
  search_artist_101: require("../assets/My Library/Image 101.png"),
  search_song_102: require("../assets/My Library/Image 102.png"),
  search_song_103: require("../assets/My Library/Image 103.png"),
  search_song_104: require("../assets/My Library/Image 104.png"),
  search_song_105: require("../assets/My Library/Image 105.png"),
  search_song_106: require("../assets/My Library/Image 106.png"),
  search_song_107: require("../assets/My Library/Image 107.png"),

  // --- Welcome Screen ---
  welcome_bg: require("../assets/Launch Screen/Image 30.png"),
  welcome_logo: require("../assets/Launch Screen - Premium/Image 113.png"),

  //-- Feed Screenn----
  Image93: require("../assets/Feed - Comment on an Audio/taylor-d_TRVE.jpg"),
  Image94: require("../assets/Feed - Comment on an Audio/music1.jpg"),

  Avartar1: require("../assets/Feed - Comment on an Audio/avt.jpg"),
  Avartar2: require("../assets/Feed - Comment on an Audio/avt1.jpg"),
  Avartar3: require("../assets/Feed - Comment on an Audio/avt2.jpg"),
  Avartar4: require("../assets/Feed - Comment on an Audio/avt3.jpg"),
};

/**
 * Hàm tiện ích để lấy ảnh an toàn,
 * Nếu không tìm thấy key, nó sẽ trả về ảnh placeholder
 */
export const getAssetImage = (key: string) => {
  return AppImages[key as keyof typeof AppImages] || placeholder;
};
