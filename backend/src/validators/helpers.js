export function requiredString(value, field, min = 1, max = 500) {
  if (typeof value !== "string" || !value.trim()) {
    return `${field} is required`;
  }
  if (value.trim().length < min) {
    return `${field} must be at least ${min} characters`;
  }
  if (value.trim().length > max) {
    return `${field} must be at most ${max} characters`;
  }
  return null;
}

export function optionalEmail(value, field = "email") {
  if (value == null || value === "") return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
    return `${field} must be a valid email`;
  }
  return null;
}

export function requiredEmail(value, field = "email") {
  if (!value) return `${field} is required`;
  return optionalEmail(value, field);
}

export function collect(...maybeErrors) {
  return maybeErrors.filter(Boolean);
}
