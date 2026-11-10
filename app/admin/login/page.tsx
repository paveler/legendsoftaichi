import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import logo from '@/assets/brand/logo.png';
import { getAdmin } from '@/lib/admin-session';
import LoginForm from './login-form';

export default async function AdminLogin() {
  // Уже залогинен — сразу в админку
  if (await getAdmin().catch(() => null)) redirect('/admin');

  return (
    <main className="admin-login">
      <div>
        <div className="admin-login-card">
          <div className="admin-login-head">
            <Image src={logo} alt="" width={72} height={72} priority />
            <h1>Вход для&nbsp;организаторов</h1>
            <p>Легенды Тайцзи II · админка</p>
          </div>
          <LoginForm />
        </div>
        <Link className="admin-login-back" href="/">← На сайт фестиваля</Link>
      </div>
    </main>
  );
}
