const ACCESS_TOKEN_KEY = "zest_access_token";
const EXPIRES_AT_KEY = "zest_access_token_expires_at";

export function setAuthSession(accessToken, expiresAtUtc) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(EXPIRES_AT_KEY, expiresAtUtc);
}

export function getAccessToken() {
  if (!isSessionValid()) {
    clearAuthSession();
    return null;
  }

  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getTokenExpiry() {
  return sessionStorage.getItem(EXPIRES_AT_KEY);
}

export function clearAuthSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_AT_KEY);
}

export function isSessionValid() {
  const expiresAtUtc = sessionStorage.getItem(EXPIRES_AT_KEY);
  if (!expiresAtUtc) {
    return false;
  }

  const expiry = Date.parse(expiresAtUtc);
  return Number.isFinite(expiry) && expiry > Date.now();
}
