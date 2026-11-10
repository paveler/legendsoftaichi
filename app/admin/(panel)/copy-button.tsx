'use client';

import { useState } from 'react';

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('ok');
    } catch {
      setState('fail');
    }
    setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" className={`adm-btn${state === 'ok' ? ' ok' : ''}`} onClick={copy}>
      {state === 'ok' ? 'Скопировано ✓' : state === 'fail' ? 'Не вышло скопировать' : label}
    </button>
  );
}
