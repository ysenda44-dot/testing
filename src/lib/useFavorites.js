import { useCallback, useEffect, useState } from 'react';

function load(key) {
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/** お気に入り（この端末のブラウザに保存） */
export function useFavorites(key) {
  const [favorites, setFavorites] = useState(() => load(key));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify([...favorites]));
    } catch {
      // プライベートブラウズなどで保存できない場合は、この画面の間だけ覚えておく
    }
  }, [key, favorites]);

  const toggle = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return [favorites, toggle];
}
