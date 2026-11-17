'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TELEGRAM_CHAT } from '@/lib/site';
import BrandText from './brand-text';

const POLL_MS = 5000;
/** Через сколько показать подсказку «если закрыли оплату — попробуйте ещё раз» */
const HINT_AFTER_MS = 30_000;

// Показывает «успех» (children) только когда Directual подтвердил оплату заказа.
// Пока не подтвердил — экран «ждём оплату» и опрос раз в 5 секунд: уведомление от ЮКассы
// может доехать позже, чем человек вернулся на сайт. Ошибки сети/бэка — просто ждём следующий опрос.
export default function PaymentGate({ id, retryHref, children }: {
  id?: string;
  /** куда вести, если оплату бросили: форма регистрации или спонсорства */
  retryHref: string;
  children: React.ReactNode;
}) {
  const [paid, setPaid] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!id || paid) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      try {
        const res = await fetch(`/api/order-status?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (res.ok && (await res.json()).isPaid === true) {
          if (!stopped) setPaid(true);
          return;
        }
      } catch { /* сеть моргнула — попробуем на следующем круге */ }
      if (!stopped) timer = setTimeout(check, POLL_MS);
    };
    check();
    const hint = setTimeout(() => setShowHint(true), HINT_AFTER_MS);
    return () => { stopped = true; clearTimeout(timer); clearTimeout(hint); };
  }, [id, paid]);

  if (paid) return <>{children}</>;

  if (!id) {
    return (
      <>
        <h1><BrandText text="Проверка оплаты" /></h1>
        <p className="pay-lead">
          Не нашли номер заказа в&nbsp;ссылке. Если оплата прошла — подтверждение придёт на&nbsp;почту.
          Если письма нет, напишите в&nbsp;телеграм&#8209;чат, разберёмся.
        </p>
        <div className="pay-actions">
          <Link className="cta" href={retryHref}>Попробовать ещё раз</Link>
          <a className="cta cta-ghost" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат</a>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="pay-kicker no-check pay-waiting" aria-live="polite">Ждём оплату</p>
      <h1><BrandText text="Проверка оплаты" /></h1>
      <p className="pay-lead">
        Как только платёж подтвердится, страница обновится сама. Обычно это несколько секунд.
      </p>
      {showHint && (
        <>
          <p className="pay-note">
            Если вы закрыли страницу оплаты, не заплатив, — попробуйте ещё раз.
            Если деньги списались, а подтверждения всё нет — напишите в&nbsp;телеграм&#8209;чат.
          </p>
          <div className="pay-actions">
            <Link className="cta" href={retryHref}>Попробовать ещё раз</Link>
            <a className="cta cta-ghost" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат</a>
          </div>
        </>
      )}
    </>
  );
}
