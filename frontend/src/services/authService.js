import apiClient from "./apiClient";

export async function loginAsync(credentials) {
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
}
