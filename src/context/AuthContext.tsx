import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api, { tokenStorage } from "../api/client";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  faculty: string;
  nationality: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // No /me endpoint, so on page load we trust whatever was cached at
  // login/register time rather than re-verifying with the server.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = tokenStorage.getAccessToken();

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // this MUST run regardless, or isLoading hangs forever

    const handleForceLogout = () => {
      setUser(null);
      tokenStorage.clearTokens();
      localStorage.removeItem("user");
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const persistSession = (accessToken: string, refreshToken: string, userData: User) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    persistSession(res.data.accessToken, res.data.refreshToken, res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      // your backend's /auth/logout expects refreshToken in the body to
      // know which session to revoke — sending none would just 400
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // ignore — clearing locally regardless of whether the server call succeeded
    } finally {
      tokenStorage.clearTokens();
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
