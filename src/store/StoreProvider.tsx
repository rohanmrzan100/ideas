'use client';
import { getSessionUser } from '@/api/auth';
import { finishRestoringSession, setUser } from '@/store/slices/app.slice';
import { AppStore, makeStore } from '@/store/store';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getSessionUser();
        if (user) {
          storeRef.current?.dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        storeRef.current?.dispatch(finishRestoringSession());
      }
    };

    initAuth();
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
