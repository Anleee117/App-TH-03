function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

export function formatDate(val) {
  if (!val) {
    return '';
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    return val;
  }
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(val) {
  if (!val) {
    return '';
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    return '';
  }
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'done') {
    return false;
  }
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) {
    return false;
  }
  return d.getTime() < Date.now();
}

export function daysLeft(dueDate) {
  if (!dueDate) {
    return 0;
  }
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) {
    return 0;
  }
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
