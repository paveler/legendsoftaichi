import Link from 'next/link';

// Фильтр по оплате через ?paid=… — живёт в URL, переживает перезагрузку и шарится ссылкой.
// По умолчанию (без параметра) — только оплаченные
export type PaidParam = 'yes' | 'no' | 'all';

export const parsePaid = (v: string | string[] | undefined): PaidParam => (v === 'no' || v === 'all' ? v : 'yes');
export const paidToBool = (p: PaidParam) => (p === 'yes' ? true : p === 'no' ? false : undefined);

const OPTIONS: { value: PaidParam; label: string }[] = [
  { value: 'yes', label: 'Оплачены' },
  { value: 'no', label: 'Не оплачены' },
  { value: 'all', label: 'Все' },
];

export default function PaidFilter({ path, current }: { path: string; current: PaidParam }) {
  return (
    <div className="adm-seg" role="group" aria-label="Фильтр по оплате">
      {OPTIONS.map((o) => (
        <Link
          key={o.value}
          href={o.value === 'yes' ? path : `${path}?paid=${o.value}`}
          className={current === o.value ? 'active' : undefined}
          aria-current={current === o.value ? 'true' : undefined}
          scroll={false}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export function PaidBadge({ paid }: { paid: boolean }) {
  return <span className={`adm-paid ${paid ? 'yes' : 'no'}`}>{paid ? 'Оплачено' : 'Не оплачено'}</span>;
}
