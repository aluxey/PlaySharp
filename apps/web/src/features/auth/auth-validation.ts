const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmailAddress(email: string) {
  const normalizedEmail = email.trim();

  if (normalizedEmail.length === 0) {
    return 'Enter your email address.';
  }

  if (!emailPattern.test(normalizedEmail)) {
    return 'Enter a valid email address.';
  }

  return null;
}

export function validateLoginPassword(password: string) {
  if (password.length === 0) {
    return 'Enter your password.';
  }

  return null;
}

export function validateDisplayName(name: string) {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    return 'Enter a display name.';
  }

  if (normalizedName.length < 2) {
    return 'Use at least 2 characters for the display name.';
  }

  return null;
}

export function validateRegisterPassword(password: string) {
  if (password.length === 0) {
    return 'Create a password.';
  }

  if (password.length < 8) {
    return 'Use at least 8 characters for the password.';
  }

  return null;
}
