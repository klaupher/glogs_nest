export function firstDayOfMonth(date: Date): Date {
  const now = date ?? new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay; // Outputs the first day of the current month
}

export function lastDayOfMonth(date: Date): Date {
  const now = date ?? new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay; // Outputs the first day of the current month
}
