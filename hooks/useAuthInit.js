'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// Call once at the app root to hydrate the session from the httpOnly
// cookie on first load / full page refresh.
export const useAuthInit = () => {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);
};
