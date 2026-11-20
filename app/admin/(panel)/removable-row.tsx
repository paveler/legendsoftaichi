'use client';

import { useState } from 'react';
import { deleteRequest, sendPaymentLink } from './actions';
import { useRemoval } from './removal';

// Строка неоплаченной заявки: «Выслать ссылку на оплату» (сразу, без подтверждения — повторная отправка безвредна)
// и «Удалить заявку»: подтверждение прямо в строке, потом строка сразу пропадает (оптимистично).
// Если Directual ответил ошибкой — строка возвращается с пометкой. Перезапроса списка нет
export default function RemovableRow({ id, className, children }: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { removed, setRemoved } = useRemoval();
  const [step, setStep] = useState<'idle' | 'confirm' | 'failed'>('idle');
  const [link, setLink] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  if (removed.has(id)) return null;

  async function sendLink() {
    setLink('sending');
    const { ok } = await sendPaymentLink(id);
    setLink(ok ? 'sent' : 'failed');
  }

  async function confirmDelete() {
    setRemoved(id, true);
    const { ok } = await deleteRequest(id);
    if (!ok) {
      setRemoved(id, false);
      setStep('failed');
    }
  }

  return (
    <tr className={`${className ?? ''}${step === 'confirm' ? ' is-confirm' : ''}`}>
      {children}
      <td className="r">
        {step === 'confirm' ? (
          <div className="adm-confirm">
            <span>Удалить заявку?</span>
            <button type="button" className="adm-del solid" onClick={confirmDelete} autoFocus>Да, удалить</button>
            <button type="button" className="adm-cancel" onClick={() => setStep('idle')}>Отмена</button>
          </div>
        ) : (
          <div className="adm-confirm">
            {link === 'sent' ? (
              <span className="adm-ok">Ссылка отправлена ✓</span>
            ) : (
              <>
                {link === 'failed' && <span className="adm-fail">Не отправилось</span>}
                <button type="button" className="adm-send" onClick={sendLink} disabled={link === 'sending'}>
                  {link === 'sending' ? 'Отправляем…' : link === 'failed' ? 'Ещё раз' : 'Выслать ссылку на оплату'}
                </button>
              </>
            )}
            {step === 'failed' && <span className="adm-fail">Не удалилось</span>}
            <button type="button" className="adm-del" onClick={() => setStep('confirm')}>
              {step === 'failed' ? 'Ещё раз' : 'Удалить заявку'}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
