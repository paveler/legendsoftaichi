import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Легенды Тайцзи II — фестиваль тайцзи, 19 декабря';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#f4efe4';
const INK = '#1c1a17';
const INK_SOFT = '#5b5650';
const RED = '#9e2b25';

// Шрифты — подмножества только под символы этой картинки (satori не умеет woff2)
const font = (file: string) => readFile(join(process.cwd(), 'assets/og', file));

export default async function OpengraphImage() {
  const [cormorant, manrope, notoSC] = await Promise.all([
    font('cormorant-500.ttf'),
    font('manrope-400.ttf'),
    font('noto-serif-sc-600.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', position: 'relative',
          alignItems: 'center', justifyContent: 'center', background: PAPER, color: INK,
        }}
      >
        {/* ensō на фоне */}
        <svg width="620" height="620" viewBox="0 0 200 200"
          style={{ position: 'absolute', left: 290, top: 5, opacity: 0.09 }}>
          <path
            d="M100 18c46 0 82 36 82 82s-36 82-82 82-82-36-82-82c0-30 15-55 38-70"
            fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" transform="rotate(-12 100 100)"
          />
        </svg>

        {/* вертикальная надпись — satori не знает writing-mode, поэтому столбиком */}
        <div
          style={{
            position: 'absolute', right: 90, top: 0, bottom: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: 22, fontFamily: 'Noto Serif SC', fontSize: 44, opacity: 0.75,
          }}
        >
          {'太極傳奇'.split('').map((ch) => <span key={ch}>{ch}</span>)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 22, letterSpacing: 8, color: INK_SOFT }}>
            ФЕСТИВАЛЬ ТАЙЦЗИ
          </div>
          <div style={{ fontFamily: 'Cormorant', fontSize: 132, lineHeight: 1, marginTop: 30 }}>
            Легенды Тайцзи
          </div>
          <div style={{ fontFamily: 'Cormorant', fontSize: 64, letterSpacing: 26, color: RED, marginTop: 14, paddingLeft: 26 }}>
            II
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 30 }}>
            <div style={{ width: 56, height: 1, background: INK, opacity: 0.4 }} />
            <div style={{ fontFamily: 'Cormorant', fontSize: 38, letterSpacing: 3 }}>19 декабря · Москва</div>
            <div style={{ width: 56, height: 1, background: INK, opacity: 0.4 }} />
          </div>
          <div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, marginTop: 34, borderRadius: 6, background: RED, color: PAPER,
              fontFamily: 'Noto Serif SC', fontSize: 22, lineHeight: 1.05,
            }}
          >
            <span>成</span>
            <span>龍</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute', bottom: 34, left: 0, right: 0, display: 'flex', justifyContent: 'center',
            fontFamily: 'Manrope', fontSize: 20, color: INK_SOFT, letterSpacing: 1,
          }}
        >
          Регистрация открыта · Академия Цигун и Тайцзи Cheng Long
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' },
        { name: 'Manrope', data: manrope, weight: 400, style: 'normal' },
        { name: 'Noto Serif SC', data: notoSC, weight: 600, style: 'normal' },
      ],
    },
  );
}
