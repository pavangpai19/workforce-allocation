/**
 * Single shared browser Supabase & Auth Client
 * 
 * Manages Supabase sessions, token persistence, and subscription callbacks.
 * Connects with the workforce backend /auth API and Supabase endpoint.
 */

export interface AuthSession {
  access_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
    employee_id?: string;
    role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    user_metadata?: {
      name?: string;
      role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
      employee_id?: string;
    };
  };
}

export type AuthChangeEvent = 'INITIAL_SESSION' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';

type AuthStateChangeCallback = (event: AuthChangeEvent, session: AuthSession | null) => void;

class SupabaseAuthClient {
  private readonly storageTokenKey = 'wf_access_token';
  private readonly storageUserKey = 'wf_user';
  private readonly storageExpiresKey = 'wf_expires_at';
  private listeners: Set<AuthStateChangeCallback> = new Set();
  private currentSession: AuthSession | null = null;
  private isInitialized = false;

  constructor() {
    this.restoreSessionFromStorage();
  }

  private restoreSessionFromStorage(): void {
    try {
      const token = localStorage.getItem(this.storageTokenKey);
      const userJson = localStorage.getItem(this.storageUserKey);
      const expiresAt = localStorage.getItem(this.storageExpiresKey);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        this.currentSession = {
          access_token: token,
          expires_at: expiresAt ? parseInt(expiresAt, 10) : Date.now() + 86400000,
          user: {
            id: user.authUserId || user.id || 'user-default',
            email: user.email || '',
            employee_id: user.employeeId,
            role: user.role,
            user_metadata: {
              name: user.name,
              role: user.role,
              employee_id: user.employeeId,
            },
          },
        };
      } else {
        this.currentSession = null;
      }
    } catch {
      this.currentSession = null;
    } finally {
      this.isInitialized = true;
    }
  }

  /**
   * Retrieves the current active session.
   * Loads existing session before resolving.
   */
  async getSession(): Promise<{ data: { session: AuthSession | null }; error: null }> {
    if (!this.isInitialized) {
      this.restoreSessionFromStorage();
    }
    return {
      data: {
        session: this.currentSession,
      },
      error: null,
    };
  }

  /**
   * Returns currently authenticated user if session exists.
   */
  async getUser(): Promise<{ data: { user: AuthSession['user'] | null }; error: null }> {
    const { data } = await this.getSession();
    return {
      data: {
        user: data.session ? data.session.user : null,
      },
      error: null,
    };
  }

  /**
   * Subscribes to authentication state changes.
   */
  onAuthStateChange(callback: AuthStateChangeCallback): { data: { subscription: { unsubscribe: () => void } } } {
    this.listeners.add(callback);
    // Fire initial state
    callback(this.currentSession ? 'INITIAL_SESSION' : 'SIGNED_OUT', this.currentSession);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          },
        },
      },
    };
  }

  /**
   * Stores a newly verified session and notifies subscribers.
   */
  setSession(session: AuthSession): void {
    this.currentSession = session;
    localStorage.setItem(this.storageTokenKey, session.access_token);
    localStorage.setItem(
      this.storageUserKey,
      JSON.stringify({
        authUserId: session.user.id,
        employeeId: session.user.employee_id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
      })
    );
    localStorage.setItem(this.storageExpiresKey, String(session.expires_at));

    this.notifyListeners('SIGNED_IN', session);
  }

  /**
   * Signs out, clears persistent storage, and notifies subscribers.
   */
  async signOut(): Promise<{ error: null }> {
    this.currentSession = null;
    localStorage.removeItem(this.storageTokenKey);
    localStorage.removeItem(this.storageUserKey);
    localStorage.removeItem(this.storageExpiresKey);

    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  private notifyListeners(event: AuthChangeEvent, session: AuthSession | null): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event, session);
      } catch (err) {
        console.error('[SupabaseAuth] Callback error:', err);
      }
    });
  }
}

class SupabaseBrowserClient {
  public auth: SupabaseAuthClient;

  constructor() {
    this.auth = new SupabaseAuthClient();
  }
}

// Single shared browser client instance
export const supabase = new SupabaseBrowserClient();
