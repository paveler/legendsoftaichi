'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Participant } from '@/lib/participants';
import type { FormType } from '@/lib/registration';
import { updateRequest } from './actions';

// «Изменить» в строке заявки: модалка с полями заявки по роли. Сохраняем через POST в getparticipants
// (id + data), потом перезапрашиваем страницу. Добавлять/убирать формы и участников нельзя — от их числа
// зависит взнос, а сумму правка не трогает
type Draft = {
  fullName: string; email: string; phone: string; age: string; school: string; experience: string;
  forms: { type: FormType; description: string }[];
  members: { fullName: string; age: string }[];
};

const toDraft = (p: Participant): Draft => ({
  fullName: p.fullName === '—' ? '' : p.fullName,
  email: p.email ?? '',
  phone: p.phone ?? '',
  age: p.age ? String(p.age) : '',
  school: p.school ?? '',
  experience: p.experience ?? '',
  forms: (p.forms ?? []).map((f) => ({ type: f.type, description: f.description ?? '' })),
  members: (p.members ?? []).map((m) => ({ fullName: m.fullName ?? '', age: m.age ? String(m.age) : '' })),
});

const ERRORS: Record<string, string> = {
  'forms.weapon': 'С оружием — не больше 3 форм',
  'forms.empty': 'Без оружия — не больше 3 форм',
};

export default function EditRequest({ p }: { p: Participant }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<Draft>(() => toDraft(p));
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [state, setState] = useState<'idle' | 'saving' | 'failed'>('idle');
  const [saved, setSaved] = useState(false);

  const role = p.role;
  const cls = (key: string) => (invalid.has(key) ? 'invalid' : undefined);

  function open() {
    setDraft(toDraft(p));
    setInvalid(new Set());
    setState('idle');
    setSaved(false);
    dialog.current?.showModal();
  }

  const set = (key: keyof Omit<Draft, 'forms' | 'members'>) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));
  const setForm = (i: number, patch: Partial<Draft['forms'][number]>) =>
    setDraft((d) => ({ ...d, forms: d.forms.map((f, j) => (j === i ? { ...f, ...patch } : f)) }));
  const setMember = (i: number, patch: Partial<Draft['members'][number]>) =>
    setDraft((d) => ({ ...d, members: d.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    const res = await updateRequest(p.id, p.raw, {
      ...draft,
      age: Number(draft.age),
      members: draft.members.map((m) => ({ ...m, age: Number(m.age) })),
    });
    if (res.ok) {
      setSaved(true);
      dialog.current?.close();
      router.refresh();
      return;
    }
    setInvalid(new Set(res.errors ?? []));
    setState('failed');
  }

  const typeErrors = [...invalid].filter((k) => ERRORS[k]).map((k) => ERRORS[k]);

  return (
    <>
      <button type="button" className="adm-send" onClick={open}>{saved ? 'Сохранено ✓' : 'Изменить'}</button>
      <dialog ref={dialog} className="adm-modal" onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <form onSubmit={onSubmit} noValidate>
          <header>
            <h2>{role === 'group' ? 'Группа' : role === 'athlete' ? 'Участник' : 'Зритель'}{p.orderNum && <small>№ {p.orderNum}</small>}</h2>
            <button type="button" className="adm-cancel" onClick={() => dialog.current?.close()} aria-label="Закрыть">✕</button>
          </header>

          <div className="adm-fields">
            <label className="wide">
              <span>{role === 'group' ? 'Руководитель' : 'Имя и фамилия'}</span>
              <input value={draft.fullName} onChange={set('fullName')} className={cls('fullName')} />
            </label>
            {role === 'athlete' && (
              <label>
                <span>Возраст</span>
                <input type="number" inputMode="numeric" value={draft.age} onChange={set('age')} className={cls('age')} />
              </label>
            )}
            {(role === 'athlete' || role === 'group') && (
              <label className={role === 'group' ? 'wide' : undefined}>
                <span>Школа{role === 'athlete' && ' (необязательно)'}</span>
                <input value={draft.school} onChange={set('school')} className={cls('school')} />
              </label>
            )}
            {role === 'athlete' && (
              <label className="wide">
                <span>Стаж</span>
                <input value={draft.experience} onChange={set('experience')} className={cls('experience')} />
              </label>
            )}
            <label>
              <span>Почта</span>
              <input type="email" value={draft.email} onChange={set('email')} className={cls('email')} />
            </label>
            <label>
              <span>Телефон</span>
              <input type="tel" value={draft.phone} onChange={set('phone')} />
            </label>
          </div>

          {draft.forms.length > 0 && (
            <fieldset>
              <legend>Выступления</legend>
              {draft.forms.map((f, i) => (
                <div key={i} className="adm-form-row">
                  <div className="adm-seg" role="group" aria-label={`Тип формы ${i + 1}`}>
                    {(['empty', 'weapon'] as const).map((t) => (
                      <button key={t} type="button" className={f.type === t ? 'active' : undefined} onClick={() => setForm(i, { type: t })}>
                        {t === 'weapon' ? 'с оружием' : 'без оружия'}
                      </button>
                    ))}
                  </div>
                  <input value={f.description} onChange={(e) => setForm(i, { description: e.target.value })} className={cls(`forms.${i}`)} placeholder="Название формы" />
                </div>
              ))}
              {typeErrors.map((t) => <p key={t} className="adm-fail">{t}</p>)}
            </fieldset>
          )}

          {draft.members.length > 0 && (
            <fieldset>
              <legend>Участники группы</legend>
              {draft.members.map((m, i) => (
                <div key={i} className="adm-member-row">
                  <span className="muted">{i + 1}</span>
                  <input value={m.fullName} onChange={(e) => setMember(i, { fullName: e.target.value })} className={cls(`members.${i}.fullName`)} placeholder="Имя и фамилия" />
                  <input type="number" inputMode="numeric" value={m.age} onChange={(e) => setMember(i, { age: e.target.value })} className={cls(`members.${i}.age`)} placeholder="Возраст" />
                </div>
              ))}
            </fieldset>
          )}

          <footer>
            {state === 'failed' && <span className="adm-fail">{invalid.size ? 'Проверьте подсвеченные поля' : 'Не сохранилось, попробуйте ещё раз'}</span>}
            <button type="button" className="adm-cancel" onClick={() => dialog.current?.close()}>Отмена</button>
            <button type="submit" className="adm-btn" disabled={state === 'saving'}>{state === 'saving' ? 'Сохраняем…' : 'Сохранить'}</button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
