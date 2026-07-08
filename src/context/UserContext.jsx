import { useState, useCallback } from 'react';
import { getUser as getStoredUser, setUser as persistUser, clearUser as clearPersistedUser } from '../service/api';
import { UserContext } from './userContextInstance';

/**
 * Source de vérité unique pour l'utilisateur connecté côté client. Avant ce
 * contexte, chaque composant relisait sessionStorage indépendamment
 * (AdminDashboard, Profile...) sans jamais se notifier mutuellement : modifier
 * le profil ne rafraîchissait pas l'avatar de la sidebar sans recharger la page.
 */
export function UserProvider({ children }) {
  const [user, setUserState] = useState(() => getStoredUser());

  const setUser = useCallback((newUser) => {
    persistUser(newUser);
    setUserState(newUser);
  }, []);

  const clearUser = useCallback(() => {
    clearPersistedUser();
    setUserState(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}
