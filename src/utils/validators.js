export function validateTitle(title) {
  if (!title || typeof title !== 'string') {
    return false;
  }
  return title.trim().length > 0;
}

export function validateDueDate(dateStr) {
  if (!dateStr) {
    return false;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return false;
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d.getTime() >= now.getTime();
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return email.trim().includes('@') && email.trim().includes('.');
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const clean = phone.trim();
  return clean.length >= 9 && clean.length <= 11;
}
