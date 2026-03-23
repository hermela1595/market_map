import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "mm_token";
const USER_KEY = "mm_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore the last saved session without calling /api/auth/me.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Backfill token from dedicated key if not present in user object
        if (!parsed.token) {
          parsed.token = localStorage.getItem(TOKEN_KEY) ?? undefined;
        }
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Call after a successful register or login response */
  function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
