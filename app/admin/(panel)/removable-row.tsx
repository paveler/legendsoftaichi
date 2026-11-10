'use client';

import { useState } from 'react';
import { deleteRequest } from './actions';
import { useRemoval } from './removal';

// Строка с «Удалить заявку»: подтверждение прямо в строке, потом строка сразу пропадает (оптимистично).
// Если Directual ответил ошибкой — строка возвращается с пометкой. Перезапроса списка нет
export default function RemovableRow({ id, className, children }: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { removed, setRemoved } = useRemoval();
  const [step, setStep] = useState<'idle' | 'confirm' | 'failed'>('idle');

  if (removed.has(id)) return null;

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
