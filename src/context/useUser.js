import { useContext } from 'react';
import { UserContext } from './userContextInstance';

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser() doit être appelé à l\'intérieur de <UserProvider>');
  }
  return ctx;
}
