// Progress tracking service

export interface ProgressEntry {
  date: string;
  weight: number;
  bmi: number;
}

const PROGRESS_KEY = 'fitness_progress';

function getAll(): Record<string, ProgressEntry[]> {
  return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
}

export const progressService = {
  addEntry(userId: string, entry: ProgressEntry) {
    const all = getAll();
    if (!all[userId]) all[userId] = [];
    all[userId].push(entry);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  },

  getEntries(userId: string): ProgressEntry[] {
    return getAll()[userId] || [];
  },
};
