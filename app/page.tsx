import RegistrationForm from './registration-form';

export default function Home() {
  return (
    <>
      <header className="hero">
        <svg className="enso" viewBox="0 0 200 200" aria-hidden="true">
          <path
            d="M100 18c46 0 82 36 82 82s-36 82-82 82-82-36-82-82c0-30 15-55 38-70"
            fill="none" stroke="#1c1a17" strokeWidth="13" strokeLinecap="round"
          />
        </svg>
        <div className="vertical" aria-hidden="true">太極傳奇</div>
        <div className="hero-inner">
          <p className="eyebrow">Фестиваль тайцзи</p>
          <h1>Легенды Тайцзи<span className="num">II</span></h1>
          <p className="date">19 декабря</p>
          <div><span className="seal" aria-hidden="true">成龍</span></div>
          <a className="cta" href="#reg">Регистрация</a>
        </div>
      </header>

      <section className="block" id="reg">
        <div className="wrap">
          <RegistrationForm />
        </div>
      </section>

      <footer>
        Организатор —{' '}
        <a href="https://taijipro.com/" target="_blank" rel="noopener">Академия Цигун и Тайцзи Cheng Long</a>
      </footer>
    </>
  );
}
