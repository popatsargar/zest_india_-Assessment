import { createContext, useEffect, useMemo, useState } from "react";
import { loginAsync } from "../services/authService";
import {
  clearAuthSession,
  getAccessToken,
  getTokenExpiry,
  setAuthSession
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

function decodeJwtSubject(token) {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(base64));
    return parsed?.name ?? parsed?.sub ?? "User";
  } catch {
    return "User";
  }
}

export function AuthProvider({ children }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("zest_access_token");
    const expiresAtUtc = sessionStorage.getItem("zest_access_token_expires_at");
    const expiry = expiresAtUtc ? Date.parse(expiresAtUtc) : NaN;
    const hasValidSession = token && Number.isFinite(expiry) && expiry > Date.now();

    if (hasValidSession) {
      setIsAuthenticated(true);
      setUsername(decodeJwtSubject(token));
    } else {
      clearAuthSession();
      setIsAuthenticated(false);
      setUsername("");
    }

    setIsInitializing(false);
  }, []);

  const login = async (credentials) => {
    setIsAuthLoading(true);
    try {
      const response = await loginAsync(credentials);
      setAuthSession(response.accessToken, response.expiresAtUtc);
      setIsAuthenticated(true);
      setUsername(decodeJwtSubject(response.accessToken));
      return response;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
    setUsername("");
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isInitializing,
      isAuthLoading,
      username,
      token: getAccessToken(),
      tokenExpiry: getTokenExpiry(),
      login,
      logout
    }),
    [isAuthenticated, isInitializing, isAuthLoading, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
