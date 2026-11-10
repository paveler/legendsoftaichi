'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Локальный список удалённых строк: таблица и счётчик обновляются без перезапроса к Directual
const Ctx = createContext<{ removed: Set<string>; setRemoved: (id: string, on: boolean) => void } | null>(null);

export function RemovalProvider({ children }: { children: React.ReactNode }) {
  const [removed, set] = useState<Set<string>>(() => new Set());
  const setRemoved = useCallback((id: string, on: boolean) => {
    set((prev) => {
      const next = new Set(prev);
      if (on) next.add(id); else next.delete(id);
      return next;
    });
  }, []);
  const value = useMemo(() => ({ removed, setRemoved }), [removed, setRemoved]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRemoval() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRemoval вне RemovalProvider');
  return ctx;
}

/** Счётчик в заголовке: с сервера минус удалённые на клиенте */
export function LiveCount({ total }: { total: number }) {
  const { removed } = useRemoval();
  return <>{Math.max(0, total - removed.size)}</>;
}
