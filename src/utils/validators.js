export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateRegistrationCode(code) {
  const codeRegex = /^[A-Z0-9]{12}$/;
  return codeRegex.test(code);
}

export function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}