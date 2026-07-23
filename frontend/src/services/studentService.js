import apiClient from "./apiClient";

function unwrapResponse(response) {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  return response.data;
}

export async function getStudentsAsync() {
  const response = await apiClient.get("/api/students");
  return unwrapResponse(response);
}

export async function createStudentAsync(payload) {
  const response = await apiClient.post("/api/students", payload);
  return unwrapResponse(response);
}

export async function updateStudentAsync(studentId, payload) {
  const response = await apiClient.put(`/api/students/${studentId}`, payload);
  return unwrapResponse(response);
}

export async function deleteStudentAsync(studentId) {
  await apiClient.delete(`/api/students/${studentId}`);
}
