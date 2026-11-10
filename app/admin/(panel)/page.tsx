import { redirect } from 'next/navigation';
import { ADMIN_NAV } from './nav';

// Отдельной главной пока нет — открываем первый раздел
export default function AdminHome() {
  redirect(ADMIN_NAV[0].href);
}
