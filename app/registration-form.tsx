'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import logo from '@/assets/brand/logo.png';
import {
  MAX_FORMS, MAX_PER_TYPE, parseRegistration,
  type FormType, type RegisterResult, type Role,
} from '@/lib/registration';
import BrandText from './brand-text';

interface Slot { id: number; type: FormType; description: string }

let slotSeq = 0;
const newSlot = (type: FormType = 'empty'): Slot => ({ id: ++slotSeq, type, description: '' });

export default function RegistrationForm() {
  const [role, setRole] = useState<Role>('spectator');
  const [fields, setFields] = useState({ fullName: '', age: '', email: '', phone: '', school: '', experience: '' });
  const [slots, setSlots] = useState<Slot[]>(() => [newSlot()]);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const count = (type: FormType) => slots.filter((s) => s.type === type).length;
  // тип недоступен для слота, если лимит по нему уже выбран другими слотами
  const typeFull = (s: Slot, type: FormType) => s.type !== type && count(type) >= MAX_PER_TYPE;

  const clearInvalid = (key: string) =>
    setInvalid((prev) => { if (!prev.has(key)) return prev; const next = new Set(prev); next.delete(key); return next; });

  const setField = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    clearInvalid(key);
  };

  const updateSlot = (id: number, patch: Partial<Slot>) =>
    setSlots((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const cls = (key: string) => (invalid.has(key) ? 'invalid' : undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const payload = {
      ...fields,
      role,
      age: fields.age === '' ? undefined : Number(fields.age),
      forms: slots.map(({ type, description }) => ({ type, description })),
    };
    const parsed = parseRegistration(payload);
    if (!parsed.ok) {
      setInvalid(new Set(parsed.errors));
      setError('Заполните обязательные поля.');
      // фокус на первое ошибочное поле — после ре-рендера с классами .invalid
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('.invalid')?.focus());
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/register', {
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
      document.getElementById('reg')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Не удалось отправить заявку. Попробуйте ещё раз или напишите организатору.');
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="done">
        <Image className="done-logo" src={logo} alt="" sizes="140px" />
        <h2><BrandText text="До встречи" /></h2>
        <p>Регистрация прошла успешно. Ждём вас 19 декабря.</p>
      </div>
    );
  }

  return (
    <>
      <h2><BrandText text="Запись на фестиваль" /></h2>
      <p className="lead">Зрителем или участником — заполните форму ниже.</p>

      <form ref={formRef} onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="fullName">Имя и фамилия <span className="req">*</span></label>
          <input id="fullName" type="text" autoComplete="name" className={cls('fullName')}
            value={fields.fullName} onChange={setField('fullName')} />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="email">Эл. почта <span className="req">*</span></label>
            <input id="email" type="email" autoComplete="email" className={cls('email')}
              value={fields.email} onChange={setField('email')} />
          </div>
          <div className="field">
            <label htmlFor="phone">Телефон</label>
            <input id="phone" type="tel" autoComplete="tel" value={fields.phone} onChange={setField('phone')} />
          </div>
        </div>

        <div className="field">
          <span className="label">Как участвуете <span className="req">*</span></span>
          <div className="seg" role="radiogroup">
            <input type="radio" id="r-spectator" name="role" checked={role === 'spectator'}
              onChange={() => setRole('spectator')} />
            <label htmlFor="r-spectator">Зритель</label>
            <input type="radio" id="r-athlete" name="role" checked={role === 'athlete'}
              onChange={() => setRole('athlete')} />
            <label htmlFor="r-athlete">Спортсмен</label>
          </div>
        </div>

        {role === 'athlete' && (
          <div className="athlete">
            <div className="row">
              <div className="field">
                <label htmlFor="age">Возраст <span className="req">*</span></label>
                <input id="age" type="number" min={3} max={120} inputMode="numeric" className={cls('age')}
                  value={fields.age} onChange={setField('age')} />
              </div>
              <div className="field">
                <label htmlFor="experience">Стаж занятий <span className="req">*</span></label>
                <input id="experience" type="text" placeholder="например, 5 лет" className={cls('experience')}
                  value={fields.experience} onChange={setField('experience')} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="school">Школа</label>
              <input id="school" type="text" value={fields.school} onChange={setField('school')} />
            </div>

            <div className="field">
              <span className="label">Выступления <span className="req">*</span></span>
              <p className="forms-hint">До {MAX_PER_TYPE} форм без оружия и до {MAX_PER_TYPE} с оружием.</p>
            </div>
            <div className="slots">
              {slots.map((s) => (
                <div className="slot" key={s.id}>
                  <div className="slot-top">
                    <div className="seg">
                      <input type="radio" id={`t-${s.id}-e`} name={`type-${s.id}`} checked={s.type === 'empty'}
                        disabled={typeFull(s, 'empty')}
                        onChange={() => updateSlot(s.id, { type: 'empty' })} />
                      <label htmlFor={`t-${s.id}-e`}>Без оружия</label>
                      <input type="radio" id={`t-${s.id}-w`} name={`type-${s.id}`} checked={s.type === 'weapon'}
                        disabled={typeFull(s, 'weapon')}
                        onChange={() => updateSlot(s.id, { type: 'weapon' })} />
                      <label htmlFor={`t-${s.id}-w`}>С оружием</label>
                    </div>
                    {slots.length > 1 && (
                      <button type="button" className="remove" aria-label="Удалить форму"
                        onClick={() => { setSlots((all) => all.filter((x) => x.id !== s.id)); setInvalid(new Set()); }}>
                        ×
                      </button>
                    )}
                  </div>
                  <textarea rows={2} placeholder="Название и описание формы *"
                    className={cls(`forms.${slots.indexOf(s)}`)} value={s.description}
                    onChange={(e) => { updateSlot(s.id, { description: e.target.value }); clearInvalid(`forms.${slots.indexOf(s)}`); }} />
                </div>
              ))}
            </div>
            {slots.length < MAX_FORMS && (
              <button type="button" className="add" onClick={() => setSlots((all) => [
                  ...all,
                  newSlot(all.filter((s) => s.type === 'empty').length < MAX_PER_TYPE ? 'empty' : 'weapon'),
                ])}>
                + Добавить форму
              </button>
            )}
          </div>
        )}

        <p className="error-msg" role="alert">{error}</p>
        <button className="submit" type="submit" disabled={sending}>
          {sending ? 'Отправляем…' : 'Зарегистрироваться'}
        </button>
      </form>
    </>
  );
}
