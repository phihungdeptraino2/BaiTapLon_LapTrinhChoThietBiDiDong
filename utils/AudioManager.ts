// utils/AudioManager.ts

// 1. Định nghĩa các key (phải khớp với 'audioKey' trong db.json)
// và 'require' file nhạc tương ứng.
const AppAudios = {
  flower: require("../assets/audio/music1.mp3"),
  shape_of_you: require("../assets/audio/music2.mp3"),

  // ✅ BỔ SUNG: Thêm các file nhạc khác của bạn ở đây
  // ten_key_trong_db_json: require('../assets/audio/ten_file.mp3'),
};

// 2. Hàm tiện ích để lấy file audio một cách an toàn
export const getAssetAudio = (key?: string) => {
  if (!key) return null;
  return AppAudios[key as keyof typeof AppAudios] || null;
};
