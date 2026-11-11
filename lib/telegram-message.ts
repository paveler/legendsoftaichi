// Сообщение со списком выступлений для телеграм-канала.
// Вставляется руками в клиент телеги — там работает «клиентский» маркдаун:
// **жирный**, __курсив__ (не MarkdownV2 из Bot API, экранировать ничего не нужно).
// Два списка — с оружием и без: по ним формируют ковры. Человек с несколькими
// формами попадает в список столько раз, сколько форм заявил. Про деньги — ни слова.
import { plural } from './plural';

interface AthleteLike {
  fullName: string;
  school?: string;
  forms?: { type: 'empty' | 'weapon'; description?: string }[];
}

const performances = (n: number) => `${n} ${plural(n, 'выступление', 'выступления', 'выступлений')}`;

function section(title: string, athletes: AthleteLike[], type: 'empty' | 'weapon'): string[] {
  const rows = athletes.flatMap((a) =>
    (a.forms ?? [])
      .filter((f) => f.type === type)
      .map((f) => {
        const school = a.school?.trim();
        const form = f.description?.trim() || 'форма не указана';
        return `${a.fullName}${school ? ` (${school})` : ''} — ${form}`;
      }),
  );
  if (!rows.length) return [];
  return ['', `**${title} · ${rows.length}**`, ...rows.map((r, i) => `${i + 1}. ${r}`)];
}

export function athletesMessage(athletes: AthleteLike[]): string {
  const weapon = section('С оружием', athletes, 'weapon');
  const empty = section('Без оружия', athletes, 'empty');
  const total = athletes.reduce((acc, a) => acc + (a.forms?.length ?? 0), 0);
  const people = athletes.length;
  return [
    `**Легенды Тайцзи II — выступления**`,
    `__19 декабря, Москва · ${people} ${plural(people, 'спортсмен', 'спортсмена', 'спортсменов')}, ${performances(total)}__`,
    ...weapon,
    ...empty,
  ].join('\n');
}
