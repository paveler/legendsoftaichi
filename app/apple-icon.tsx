import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Та же печать с ensō, что и в icon.svg — iOS не берёт SVG для домашнего экрана
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#9e2b25' }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path
            d="M32 11c11.6 0 21 9.4 21 21s-9.4 21-21 21-21-9.4-21-21c0-7.7 4.1-14.4 10.2-18"
            fill="none" stroke="#f4efe4" strokeWidth="6" strokeLinecap="round" transform="rotate(-12 32 32)"
          />
        </svg>
      </div>
    ),
    size,
  );
}
