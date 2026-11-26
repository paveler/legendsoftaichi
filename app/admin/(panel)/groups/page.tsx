import { getParticipants, type Participant } from '@/lib/participants';
import { rub } from '@/lib/registration';
import { plural } from '@/lib/plural';
import AdminPage, { AdminEmpty, AdminError } from '../admin-page';
import Contacts from '../contacts';
import { ADMIN_NAV } from '../nav';
import EditRequest from '../edit-request';
import RemovableRow from '../removable-row';
import { LiveCount, RemovalProvider } from '../removal';
import PaidFilter, { PaidBadge, paidToBool, parsePaid } from '../paid-filter';

const { title, hint } = ADMIN_NAV[1];

type Props = { searchParams: Promise<{ paid?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const paid = parsePaid((await searchParams).paid);
  const filter = <PaidFilter path="/admin/groups" current={paid} />;
  let groups: Participant[];
  try {
    groups = await getParticipants('group', paidToBool(paid));
  } catch (e) {
    console.error('[admin/groups]', e);
    return <AdminPage title={title} hint={hint} filters={filter}><AdminError text="Не удалось загрузить группы из Directual" /></AdminPage>;
  }

  return (
    <RemovalProvider>
      <AdminPage title={title} hint={hint} count={<LiveCount total={groups.length} />} filters={filter}>
        {groups.length === 0 ? <AdminEmpty text={paid === 'all' ? 'Пока ни одной группы' : 'По этому фильтру никого'} /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Школа</th>
                  <th>Участники</th>
                  <th>Выступления</th>
                  <th>Контакты</th>
                  <th>Оплата</th>
                  <th className="r">Взнос</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {groups.map((g, i) => {
                  const n = g.members?.length ?? 0;
                  const cells = (
                    <>
                      <td className="num">{i + 1}</td>
                      <td>
                        <b>{g.school || '—'}</b>
                        <small>рук. {g.fullName}</small>
                      </td>
                      <td>
                        <small>{n} {plural(n, 'человек', 'человека', 'человек')}</small>
                        <ol className="adm-members">
                          {g.members?.map((m, j) => (
                            <li key={j}>{m.fullName}{m.age ? `, ${m.age}` : ''}</li>
                          ))}
                        </ol>
                      </td>
                      <td>
                        <ul className="adm-forms">
                          {g.forms?.map((f, j) => (
                            <li key={j}>
                              <span className={`adm-tag ${f.type}`}>{f.type === 'weapon' ? 'с оружием' : 'без оружия'}</span>
                              {f.description}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td><Contacts p={g} /></td>
                      <td><PaidBadge paid={g.isPaid} /></td>
                      <td className="r">
                        <b>{rub(g.sum)}</b>
                        {g.orderNum && <small>№ {g.orderNum}</small>}
                      </td>
                    </>
                  );
                  return g.isPaid
                    ? <tr key={g.id} className="is-paid">{cells}<td className="r"><EditRequest p={g} /></td></tr>
                    : <RemovableRow key={g.id} id={g.id} className="is-unpaid" extra={<EditRequest p={g} />}>{cells}</RemovableRow>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPage>
    </RemovalProvider>
  );
}
