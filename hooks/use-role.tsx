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
  const user = useQuery(api.users.getCurrentUser);
  const role = user?.role ?? null;
  const loading = user === undefined;

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}
