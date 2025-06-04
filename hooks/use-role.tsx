'use client';

import { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const RoleContext = createContext<{ role: 'requester' | 'recommender' | null; loading: boolean }>({
  role: null,
  loading: true,
});

export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const profile = useQuery(api.users.getUserProfile);
  const role = profile?.user?.role ?? null;
  const loading = profile === undefined;

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}
