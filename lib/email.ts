// Проверка почты «по-человечески»: не «неверный формат», а что именно не так и как поправить.
// emailError — блокирующая ошибка (общая для формы и сервера), suggestEmail — подсказка про опечатку (только в форме)

const LOCAL_RE = /^[a-zа-яё0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zа-яё0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
const LABEL = '[a-zа-яё0-9](?:[a-zа-яё0-9-]*[a-zа-яё0-9])?';
// домен верхнего уровня — буквы (ru, com, рф) или punycode (Chrome так отдаёт кириллические домены)
const DOMAIN_RE = new RegExp(`^(?:${LABEL}\\.)+(?:[a-zа-яё]{2,}|xn--[a-z0-9-]+)$`, 'i');
const CYR = /[а-яё]/i;
const PUNYCODE = /(^|\.)xn--/i;

/** Что не так с адресом — или null, если адрес выглядит рабочим. */
export function emailError(raw: string): string | null {
  const email = raw.trim();
  if (!email) return 'Укажите почту — пришлём на неё подтверждение';
  if (/\s/.test(email)) return 'Уберите пробелы из адреса';
  const parts = email.split('@');
  if (parts.length === 1) return 'В адресе не хватает «@»';
  if (parts.length > 2) return 'В адресе должен быть только один знак «@»';
  const [local, domain] = parts;
  if (!local) return 'Перед «@» не хватает имени ящика';
  if (!domain) return 'После «@» укажите почтовый сервис, например mail.ru';
  // кириллица до «@» бывает только у кириллических доменов (…@почта.рф)
  if (CYR.test(local) && !CYR.test(domain) && !PUNYCODE.test(domain)) return 'Адрес почты пишется латиницей';
  if (!LOCAL_RE.test(local)) return 'Проверьте часть до «@» — в ней лишние символы';
  if (!domain.includes('.')) return 'Адрес не дописан: после «@» нужен домен целиком, например mail.ru';
  if (!DOMAIN_RE.test(domain)) return 'Проверьте часть после «@» — похоже, в ней опечатка';
  return null;
}

/** Настоящие домены, похожие на популярные, — их не «исправляем» */
const KNOWN = new Set([
  'gmail.com', 'googlemail.com', 'mail.ru', 'bk.ru', 'inbox.ru', 'list.ru', 'internet.ru', 'mail.com', 'mail.ua',
  'yandex.ru', 'ya.ru', 'yandex.com', 'yandex.by', 'yandex.kz', 'yandex.ua', 'rambler.ru', 'ro.ru', 'lenta.ru',
  'icloud.com', 'me.com', 'mac.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'proton.me', 'protonmail.com',
]);
/** Куда подсказываем — по убыванию популярности, при равенстве выигрывает первый */
const POPULAR = ['gmail.com', 'mail.ru', 'yandex.ru', 'ya.ru', 'bk.ru', 'inbox.ru', 'list.ru', 'rambler.ru',
  'icloud.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
/** gmail.ru, gmail, yandex.con → по имени сервиса */
const BY_NAME: Record<string, string> = {
  gmail: 'gmail.com', mail: 'mail.ru', yandex: 'yandex.ru', rambler: 'rambler.ru',
  icloud: 'icloud.com', outlook: 'outlook.com', hotmail: 'hotmail.com',
};

// русская раскладка → английская: шмфт"ьфшдюкг → ivan@mail.ru
const RU = 'йцукенгшщзхъфывапролджэячсмитьбюё"';
const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`@";
const toLatin = (s: string) => [...s].map((ch) => {
  const i = RU.indexOf(ch.toLowerCase());
  return i < 0 ? ch : EN[i];
}).join('');

/** Расстояние Дамерау — Левенштейна: перестановка соседних букв (gmial) — одна ошибка */
function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

function fixDomain(domain: string): string | null {
  if (KNOWN.has(domain)) return null;
  const byName = BY_NAME[domain.split('.')[0]];
  if (byName) return byName;
  // у коротких доменов (bk.ru) допускаем одну опечатку, у длинных — две
  const max = domain.length < 8 ? 1 : 2;
  let best: string | null = null;
  let bestDist = max + 1;
  for (const p of POPULAR) {
    const dist = distance(domain, p);
    if (dist < bestDist) { best = p; bestDist = dist; }
  }
  return best;
}

/** Исправленный адрес, если похоже на опечатку или русскую раскладку, иначе null. */
export function suggestEmail(raw: string): string | null {
  const email = raw.trim();
  const at = email.lastIndexOf('@');
  // раскладка: кириллица в домене или «"» вместо «@», и после перевода вышел популярный домен.
  // Кириллица только до «@» (иван@mail.ru) — это не раскладка, а имя по-русски: тут поможет только emailError
  if (CYR.test(email)) {
    if (at >= 0 && !CYR.test(email.slice(at))) return null;
    const latin = toLatin(email);
    const domain = latin.split('@')[1]?.toLowerCase();
    return domain && POPULAR.includes(domain) && !emailError(latin) ? latin : null;
  }
  if (at < 1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain) return null;
  const fixed = fixDomain(domain);
  return fixed && fixed !== domain ? email.slice(0, at + 1) + fixed : null;
}
