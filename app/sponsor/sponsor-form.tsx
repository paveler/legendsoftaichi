'use client';

import { useState } from 'react';
import { rub, type RegisterResult } from '@/lib/registration';
import { SPONSOR_DEFAULT, SPONSOR_MIN, SPONSOR_PRESETS, amountError, parseAmount, parseSponsorship } from '@/lib/sponsorship';

/** 50000 → «50 000» для поля ввода (без ₽) */
const group = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ');

export default function SponsorForm() {
  const [fullName, setFullName] = useState('');
  const [amountText, setAmountText] = useState(group(SPONSOR_DEFAULT));
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const amount = parseAmount(amountText);
  const amountMsg = invalid.has('amount') ? amountError(amount) : null;

  const clear = (key: string) => setInvalid((prev) => {
    if (!prev.has(key)) return prev;
    const next = new Set(prev); next.delete(key); return next;
  });

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, '').replace(/^0+/, '').slice(0, 9);
    setAmountText(digits ? group(Number(digits)) : '');
    clear('amount');
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const parsed = parseSponsorship({ fullName, amount });
    if (!parsed.ok) {
      setInvalid(new Set(parsed.errors));
      setError('Проверьте поля, отмеченные красным.');
      const form = e.currentTarget;
      requestAnimationFrame(() => form.querySelector<HTMLElement>('.invalid')?.focus());
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const r: RegisterResult = await res.json();
      if (r.paymentNeeded) {
        if (!r.paymentURL) throw new Error('no paymentURL');
        window.location.href = r.paymentURL;
        return;
      }
      setDone(true);
    } catch (err) {
      console.error(err);
      setError('Не удалось отправить. Попробуйте ещё раз или напишите организатору.');
      setSending(false);
    }
  }

  if (done) {
    return <p className="pay-lead">Спасибо! Заявку получили — свяжемся с&nbsp;вами.</p>;
  }

  return (
    <form className="sponsor-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">Имя или название компании <span className="req">*</span></label>
        <input id="fullName" type="text" autoComplete="name" className={invalid.has('fullName') ? 'invalid' : undefined}
          value={fullName} onChange={(e) => { setFullName(e.target.value); clear('fullName'); }} />
      </div>

      <div className="field">
        <label htmlFor="amount">Сумма, ₽ <span className="req">*</span></label>
        <div className="amount-input">
          <input id="amount" type="text" inputMode="numeric" className={invalid.has('amount') ? 'invalid' : undefined}
            value={amountText} onChange={onAmountChange} aria-describedby="amount-msg" />
          <span aria-hidden>₽</span>
        </div>
        <div className="presets" role="group" aria-label="Быстрый выбор суммы">
          {SPONSOR_PRESETS.map((p) => (
            <button key={p} type="button" className={amount === p ? 'active' : undefined}
              onClick={() => { setAmountText(group(p)); clear('amount'); }}>
              {rub(p)}
            </button>
          ))}
        </div>
        <p id="amount-msg" className={amountMsg ? 'field-msg' : 'field-hint'}>
          {amountMsg ?? `Можно больше — от ${rub(SPONSOR_MIN)}`}
        </p>
      </div>

      <p className="error-msg" role="alert">{error}</p>
      <button className="submit" type="submit" disabled={sending}>
        {sending ? 'Отправляем…' : Number.isFinite(amount) && amount >= SPONSOR_MIN ? `Перейти к оплате · ${rub(amount)}` : 'Перейти к оплате'}
      </button>
    </form>
  );
}
