import Image from 'next/image';
import { HASHTAGS, ORGANIZER } from '@/lib/site';
import logo from '@/assets/brand/logo.png';
import peoniesLeft from '@/assets/brand/peonies-left.png';
import peoniesRight from '@/assets/brand/peonies-right.png';

// Каркас страниц возврата из платёжки (/success, /fail): композиция hero с пионами, логотип, под ним — текст страницы
export default function PayScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="hero pay">
      <Image className="peonies peonies-l" src={peoniesLeft} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
      <Image className="peonies peonies-r" src={peoniesRight} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
      <p className="tag tag-l">{HASHTAGS[0]}</p>
      <p className="tag tag-r">{HASHTAGS[1]}</p>
      <div className="pay-inner">
        <Image className="pay-logo" src={logo} alt={ORGANIZER.name} priority sizes="120px" />
        {children}
      </div>
    </main>
  );
}
