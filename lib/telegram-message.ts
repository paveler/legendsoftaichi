// Сообщение со списком спортсменов для телеграм-канала.
// Вставляется руками в клиент телеги — там работает «клиентский» маркдаун:
// **жирный**, __курсив__ (не MarkdownV2 из Bot API, экранировать ничего не нужно).
// Про деньги — ни слова.
import { plural } from './plural';

interface AthleteLike {
  fullName: string;
  school?: string;
  forms?: { type: 'empty' | 'weapon' }[];
}

export function athletesMessage(athletes: AthleteLike[]): string {
  const lines = athletes.map((a, i) => {
    const n = a.forms?.length ?? 0;
    const forms = n ? `${n} ${plural(n, 'форма', 'формы', 'форм')}` : '';
    const tail = [a.school?.trim(), forms].filter(Boolean).join(', ');
    return `${i + 1}. ${a.fullName}${tail ? ` — ${tail}` : ''}`;
  });
  const total = athletes.length;
  return [
    `**Легенды Тайцзи II — участники**`,
    `__${total} ${plural(total, 'спортсмен', 'спортсмена', 'спортсменов')}, 19 декабря, Москва__`,
    '',
    ...lines,
  ].join('\n');
}
