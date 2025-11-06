// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook để trì hoãn một giá trị (debounce).
 * Chỉ cập nhật giá trị trả về sau khi 'value' không thay đổi
 * trong 'delay' mili-giây.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt một timer để cập nhật giá trị sau khi hết 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy timer nếu 'value' thay đổi (ví dụ: người dùng gõ tiếp)
    // hoặc khi component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

  return debouncedValue;
}