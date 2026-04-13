// User Service - Handles authentication and user profiles

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

const USERS_KEY = 'fitness_users';
const CURRENT_USER_KEY = 'fitness_current_user';
const PROFILES_KEY = 'fitness_profiles';

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function getProfiles(): UserProfile[] {
  return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
}

export const userService = {
  register(email: string, password: string, name: string): User {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const user: User = { id: crypto.randomUUID(), email, name, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Store password hash (simplified)
    localStorage.setItem(`pwd_${email}`, password);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  login(email: string, password: string): User {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user || localStorage.getItem(`pwd_${email}`) !== password) {
      throw new Error('Invalid email or password');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveProfile(profile: UserProfile) {
    const profiles = getProfiles();
    const idx = profiles.findIndex(p => p.userId === profile.userId);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  updateWeight(userId: string, newWeight: number) {
    const profiles = getProfiles();
    const idx = profiles.findIndex(p => p.userId === userId);
    if (idx >= 0) {
      profiles[idx].weight = newWeight;
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      return profiles[idx];
    }
    return null;
  },

  getProfile(userId: string): UserProfile | null {
    return getProfiles().find(p => p.userId === userId) || null;
  },
};
