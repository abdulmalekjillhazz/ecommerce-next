'use client';

import { useAuthInit } from '../../hooks/useAuthInit';

export default function AuthInitializer() {
  useAuthInit();
  return null;
}
