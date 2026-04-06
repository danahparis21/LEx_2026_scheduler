export const LEX_START_DATE = new Date(2026, 3, 6); // April 6, 2026
export const LEX_END_DATE = new Date(2026, 3, 17);   // April 17, 2026

export const ADMIN_USERNAME = 'lexusername';
export const ADMIN_PASSWORD = 'lexpassword';

export function getDayNumber(date: Date): number {
  // Use local midnight to calculate difference accurately
  const start = new Date(LEX_START_DATE.getFullYear(), LEX_START_DATE.getMonth(), LEX_START_DATE.getDate());
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// FIX: Timezone-safe date string (YYYY-MM-DD)
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const AVATAR_COLORS = [
  '#F9A8D4', '#A78BFA', '#FCA5A5', '#93C5FD',
  '#86EFAC', '#FDE68A', '#C4B5FD', '#FBCFE8',
  '#FDA4AF', '#DDD6FE',
];

export const AVATAR_EMOJIS = [
  '🌸', '🦋', '🌺', '✨', '🌷', '💖', '🌙', '⭐', '🎀', '🌼',
  '🐱', '🐰', '🦊', '🐻', '🐼', '🦄', '🐶', '🐸', '🦉', '🐧',
];