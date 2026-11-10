import { rub } from '@/lib/registration';
import { getSponsors, type Sponsor } from '@/lib/sponsors';
import Contacts from '../contacts';
import AdminPage, { AdminEmpty, AdminError } from '../admin-page';
import { ADMIN_NAV } from '../nav';

const { title, hint } = ADMIN_NAV[2];

export default async function Page() {
  let sponsors: Sponsor[];
  try {
    sponsors = await getSponsors();
  } catch (e) {
    console.error('[admin/sponsors]', e);
    return <AdminPage title={title} hint={hint}><AdminError text="Не удалось загрузить спонсоров из Directual" /></AdminPage>;
  }

  const total = sponsors.reduce((acc, s) => acc + s.sum, 0);

  return (
    <AdminPage title={title} hint={hint} count={sponsors.length}>
      {sponsors.length === 0 ? <AdminEmpty text="Спонсоров пока нет" /> : (
        <>
          <div className="adm-stats">
            <div className="adm-stat">
              <span>Всего от спонсоров</span>
              <b>{rub(total)}</b>
            </div>
            <div className="adm-stat">
              <span>Средний взнос</span>
              <b>{rub(Math.round(total / sponsors.length))}</b>
            </div>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Спонсор</th>
                  <th>Телефон</th>
                  <th>Заказ</th>
                  <th className="r">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((s, i) => (
                  <tr key={s.id}>
                    <td className="num">{i + 1}</td>
                    <td><b>{s.fullName}</b></td>
                    <td>{s.phone ? <Contacts p={s} /> : <span className="muted">—</span>}</td>
                    <td>{s.orderNum ? `№ ${s.orderNum}` : <span className="muted">—</span>}</td>
                    <td className="r"><b>{rub(s.sum)}</b></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td colSpan={3}>Итого</td>
                  <td className="r"><b>{rub(total)}</b></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </AdminPage>
  );
}
