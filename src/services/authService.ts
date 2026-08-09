import { User, LoginPayload, RegisterPayload } from '../types/auth';

const STORAGE_KEY_USER = 'intervai_auth_user';
const STORAGE_KEY_TOKEN = 'intervai_auth_token';
const STORAGE_KEY_USERS_DB = 'intervai_registered_users_db';

const DEFAULT_MOCK_USER: User = {
  id: 'usr-001',
  name: 'Alex Mercer',
  email: 'alex.mercer@dev.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  targetRole: 'Senior AI Engineer',
  createdAt: '2026-08-01'
};

export const authService = {
  /**
   * Get current authenticated user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored) as User;

      // Default initial session for immediate convenience
      this.setUserSession(DEFAULT_MOCK_USER);
      return DEFAULT_MOCK_USER;
    } catch {
      return null;
    }
  },

  /**
   * Mock login with email and password
   */
  async login(payload: LoginPayload): Promise<User> {
    await new Promise((res) => setTimeout(res, 400)); // Simulate async network call

    const email = payload.email.trim().toLowerCase();
    const registeredUsers = this.getRegisteredUsersDB();
    const existing = registeredUsers.find(u => u.email.toLowerCase() === email);

    if (existing) {
      this.setUserSession(existing);
      return existing;
    }

    if (email === DEFAULT_MOCK_USER.email.toLowerCase() || email === 'alex@dev.io' || email.includes('@')) {
      const user: User = {
        ...DEFAULT_MOCK_USER,
        email: payload.email,
        name: payload.email.split('@')[0].replace('.', ' ').toUpperCase()
      };
      this.setUserSession(user);
      return user;
    }

    throw new Error('Invalid email or password. Please check your credentials and try again.');
  },

  /**
   * Register a new user account
   */
  async register(payload: RegisterPayload): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));

    if (!payload.fullName.trim()) throw new Error('Full Name is required.');
    if (!payload.email.trim() || !payload.email.includes('@')) throw new Error('Valid email address is required.');
    if (payload.password.length < 6) throw new Error('Password must be at least 6 characters long.');
    if (payload.password !== payload.confirmPassword) throw new Error('Password confirmation does not match.');

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: payload.fullName.trim(),
      email: payload.email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      targetRole: 'Software Engineer',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save to registered DB
    const db = this.getRegisteredUsersDB();
    db.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));

    return newUser;
  },

  /**
   * Log out user
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },

  /**
   * Helper to set user session
   */
  setUserSession(user: User): void {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, `mock-jwt-token-${Date.now()}`);
  },

  getRegisteredUsersDB(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      return stored ? JSON.parse(stored) : [DEFAULT_MOCK_USER];
    } catch {
      return [DEFAULT_MOCK_USER];
    }
  }
};
