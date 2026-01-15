import { useEffect, useRef } from 'react';

export const useAutoFetch = (refresh: () => Promise<void>, intervalMs: number = 45000) => {
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    refreshRef.current();
    const intervalId = setInterval(() => {
      refreshRef.current();
    }, intervalMs);
    const handleFocus = () => {
      refreshRef.current();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [intervalMs]);
};
