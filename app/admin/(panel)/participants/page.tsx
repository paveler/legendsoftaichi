import { getParticipants, type Participant } from '@/lib/participants';
import { rub } from '@/lib/registration';
import { plural } from '@/lib/plural';
import { athletesMessage } from '@/lib/telegram-message';
import AdminPage, { AdminEmpty, AdminError } from '../admin-page';
import Contacts from '../contacts';
import CopyButton from '../copy-button';
import { ADMIN_NAV } from '../nav';
import RemovableRow from '../removable-row';
import { LiveCount, RemovalProvider } from '../removal';
import PaidFilter, { PaidBadge, paidToBool, parsePaid } from '../paid-filter';

const { title, hint } = ADMIN_NAV[0];

type Props = { searchParams: Promise<{ paid?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const paid = parsePaid((await searchParams).paid);
  const filter = <PaidFilter path="/admin/participants" current={paid} />;
  let athletes: Participant[];
  // В сообщение для телеги — только оплатившие, независимо от фильтра таблицы
  let paidAthletes: Participant[];
  try {
    [athletes, paidAthletes] = await Promise.all([
      getParticipants('athlete', paidToBool(paid)),
      getParticipants('athlete', true),
    ]);
  } catch (e) {
    console.error('[admin/participants]', e);
    return <AdminPage title={title} hint={hint} filters={filter}><AdminError text="Не удалось загрузить участников из Directual" /></AdminPage>;
  }

  return (
    <RemovalProvider>
      <AdminPage
        title={title}
        hint={hint}
        count={<LiveCount total={athletes.length} />}
        filters={filter}
        actions={paidAthletes.length > 0 && (
          <CopyButton text={athletesMessage(paidAthletes)} label={`Копировать сообщение · ${paidAthletes.length} оплатили`} />
        )}
      >
        {athletes.length === 0 ? <AdminEmpty text={paid === 'all' ? 'Пока никто не зарегистрировался' : 'По этому фильтру никого'} /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Участник</th>
                  <th>Школа</th>
                  <th>Стаж</th>
                  <th>Выступления</th>
                  <th>Контакты</th>
                  <th>Оплата</th>
                  <th className="r">Взнос</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {athletes.map((a, i) => {
                  const cells = (
                    <>
                      <td className="num">{i + 1}</td>
                      <td>
                        <b>{a.fullName}</b>
                        {a.age ? <small>{a.age} {plural(a.age, 'год', 'года', 'лет')}</small> : null}
                      </td>
                      <td>{a.school || <span className="muted">—</span>}</td>
                      <td>{a.experience || <span className="muted">—</span>}</td>
                      <td>
                        <ul className="adm-forms">
                          {a.forms?.map((f, j) => (
                            <li key={j}>
                              <span className={`adm-tag ${f.type}`}>{f.type === 'weapon' ? 'с оружием' : 'без оружия'}</span>
                              {f.description}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td><Contacts p={a} /></td>
                      <td><PaidBadge paid={a.isPaid} /></td>
                      <td className="r">
                        <b>{rub(a.sum)}</b>
                        {a.orderNum && <small>№ {a.orderNum}</small>}
                      </td>
                    </>
                  );
                  return a.isPaid
                    ? <tr key={a.id} className="is-paid">{cells}<td /></tr>
                    : <RemovableRow key={a.id} id={a.id} className="is-unpaid">{cells}</RemovableRow>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPage>
    </RemovalProvider>
  );
}
