import AdminPage from '../admin-page';
import { ADMIN_NAV } from '../nav';

const { title, hint } = ADMIN_NAV[2];

export default function Page() {
  return <AdminPage title={title} hint={hint} />;
}
