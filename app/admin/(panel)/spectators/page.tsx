import { getParticipants, type Participant } from '@/lib/participants';
import { rub } from '@/lib/registration';
import Contacts from '../contacts';
import AdminPage, { AdminEmpty, AdminError } from '../admin-page';
import { ADMIN_NAV } from '../nav';
import RemovableRow from '../removable-row';
import { LiveCount, RemovalProvider } from '../removal';
import PaidFilter, { PaidBadge, paidToBool, parsePaid } from '../paid-filter';

const { title, hint } = ADMIN_NAV[1];

type Props = { searchParams: Promise<{ paid?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const paid = parsePaid((await searchParams).paid);
  const filter = <PaidFilter path="/admin/spectators" current={paid} />;
  let spectators: Participant[];
  try {
    spectators = await getParticipants('spectator', paidToBool(paid));
  } catch (e) {
    console.error('[admin/spectators]', e);
    return <AdminPage title={title} hint={hint} filters={filter}><AdminError text="Не удалось загрузить зрителей из Directual" /></AdminPage>;
  }

  return (
    <RemovalProvider>
      <AdminPage title={title} hint={hint} count={<LiveCount total={spectators.length} />} filters={filter}>
        {spectators.length === 0 ? <AdminEmpty text={paid === 'all' ? 'Пока никто не зарегистрировался' : 'По этому фильтру никого'} /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Зритель</th>
                  <th>Контакты</th>
                  <th>Оплата</th>
                  <th className="r">Взнос</th>
                  <th aria-label="Действия" />
                </tr>
              </thead>
              <tbody>
                {spectators.map((s, i) => {
                  const cells = (
                    <>
                      <td className="num">{i + 1}</td>
                      <td><b>{s.fullName}</b></td>
                      <td><Contacts p={s} /></td>
                      <td><PaidBadge paid={s.isPaid} /></td>
                      <td className="r">
                        <b>{rub(s.sum)}</b>
                        {s.orderNum && <small>№ {s.orderNum}</small>}
                      </td>
                    </>
                  );
                  return s.isPaid
                    ? <tr key={s.id} className="is-paid">{cells}<td /></tr>
                    : <RemovableRow key={s.id} id={s.id} className="is-unpaid">{cells}</RemovableRow>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPage>
    </RemovalProvider>
  );
}
