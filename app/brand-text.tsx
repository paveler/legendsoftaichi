import { ASCENT, DESCENT, GLYPHS, SPACE, TRACKING } from '@/lib/brand-glyphs';

const H = ASCENT + DESCENT;

// Текст фирменным шрифтом пресс-волла: каждое слово — отдельный SVG, чтобы строка переносилась.
// Высота SVG = 1em. Для скринридеров — обычный текст. Символ без глифа — ошибка сборки, а не тихая дыра.
export default function BrandText({ text }: { text: string }) {
  const words = text.toUpperCase().split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="brand-text" aria-hidden="true" style={{ columnGap: `${SPACE / H}em` }}>
        {words.map((word, i) => {
          let x = 0;
          const paths = [...word].map((ch) => {
            const g = GLYPHS[ch];
            if (!g) throw new Error(`BrandText: нет глифа «${ch}»`);
            const p = <path key={x} d={g.d} transform={`translate(${x} 0)`} />;
            x += g.w + TRACKING;
            return p;
          });
          const w = x - TRACKING;
          return (
            <svg key={i} viewBox={`0 ${-ASCENT} ${w} ${H}`} fill="currentColor" style={{ width: `${w / H}em` }}>
              {paths}
            </svg>
          );
        })}
      </span>
    </>
  );
}
