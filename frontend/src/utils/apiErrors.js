const FIELD_MAP = {
  Name: "name",
  Email: "email",
  Age: "age",
  Course: "course"
};

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (!data) {
    return fallback;
  }

  return data.message ?? data.title ?? fallback;
}

export function mapApiErrorsToFields(error) {
  const errors = error?.response?.data?.errors;
  if (!errors || typeof errors !== "object") {
    return {};
  }

  return Object.entries(errors).reduce((acc, [key, messages]) => {
    const field = FIELD_MAP[key] ?? key.charAt(0).toLowerCase() + key.slice(1);
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (message) {
      acc[field] = message;
    }
    return acc;
  }, {});
}
