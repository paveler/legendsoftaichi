// Общий каркас страницы раздела: заголовок (+ счётчик и кнопки) и контент или заглушка
export default function AdminPage({ title, hint, count, actions, filters, children }: {
  title: string;
  hint?: string;
  /** число или живой счётчик (LiveCount) */
  count?: React.ReactNode;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>
            {title}
            {count !== undefined && <span className="adm-count">{count}</span>}
          </h1>
          {hint && <p>{hint}</p>}
        </div>
        {actions && <div className="adm-actions">{actions}</div>}
      </header>
      {filters && <div className="adm-filters">{filters}</div>}
      {children ?? <AdminEmpty />}
    </>
  );
}

export function AdminEmpty({ text = 'Здесь пока пусто' }: { text?: string }) {
  return (
    <div className="adm-empty">
      <span aria-hidden>☯</span>
      <p>{text}</p>
    </div>
  );
}

export function AdminError({ text }: { text: string }) {
  return <div className="adm-error" role="alert">{text}</div>;
}
