import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Lookups } from '../types';

/** loads departments / locations / sections ... once for dropdowns and names */
export function useLookups() {
  const [lookups, setLookups] = useState<Lookups | null>(null);
  useEffect(() => {
    api.lookups().then(setLookups).catch(() => setLookups(null));
  }, []);
  return lookups;
}
