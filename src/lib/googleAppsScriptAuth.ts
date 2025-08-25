// Google Apps Script Authentication Service
// এই সার্ভিসটি Google Apps Script ব্যাকএন্ডের সাথে প্রমাণীকরণ পরিচালনা করে।

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    username: string;
    permissions: string[];
  };
}

interface SessionData {
  sessionId: string;
  username: string;
  permissions: string[];
  expiresAt: number;
}

class GoogleAppsScriptAuthService {
  private SCRIPT_URL = '';
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  // ব্যবহারকারীর দেওয়া নতুন URL দিয়ে আপডেট করা হয়েছে
  private readonly DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySaHqnDCFK-PYVwvKPeaQMbJvVPQrSk2DORY1lH7SE-D12lsi5GSFEnEcegR__bhE6uQ/exec';

  constructor() {
    // শুরুতে কনফিগারেশন লোড করা হচ্ছে
    this.loadConfig();
    
    // কনফিগারেশন আপডেট করার জন্য গ্লোবাল ফাংশন
    (window as any).updateGoogleAppsScriptConfig = (scriptUrl: string) => {
      try {
        this.SCRIPT_URL = scriptUrl;
        const saved = localStorage.getItem('admin_config');
        const cfg = saved ? JSON.parse(saved) : {};
        cfg.googleAppsScriptUrl = scriptUrl;
        localStorage.setItem('admin_config', JSON.stringify(cfg));
        console.log('Google Apps Script URL updated:', scriptUrl);
      } catch (e) {
        console.error('Failed to persist Google Apps Script URL:', e);
      }
    };
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('admin_config');
      if (saved) {
        const config = JSON.parse(saved);
        if (config.googleAppsScriptUrl && typeof config.googleAppsScriptUrl === 'string') {
          this.SCRIPT_URL = config.googleAppsScriptUrl;
        } else {
          config.googleAppsScriptUrl = this.DEFAULT_SCRIPT_URL;
          localStorage.setItem('admin_config', JSON.stringify(config));
          this.SCRIPT_URL = this.DEFAULT_SCRIPT_URL;
        }
        console.log('Loaded Google Apps Script URL from config:', this.SCRIPT_URL);
      } else {
        // ডিফল্ট URL দিয়ে কনফিগারেশন ইনিশিয়ালাইজ করা হচ্ছে
        const config = {
          googleSheetsApiKey: '',
          portfolioSpreadsheetId: '',
          adminSpreadsheetId: '',
          googleAppsScriptUrl: this.DEFAULT_SCRIPT_URL,
        };
        localStorage.setItem('admin_config', JSON.stringify(config));
        this.SCRIPT_URL = this.DEFAULT_SCRIPT_URL;
        console.log('Initialized Google Apps Script URL:', this.SCRIPT_URL);
      }
    } catch (error) {
      console.error('Error loading Google Apps Script config:', error);
      // ত্রুটির ক্ষেত্রে ডিফল্ট URL ব্যবহার করা হচ্ছে
      this.SCRIPT_URL = this.DEFAULT_SCRIPT_URL;
    }
  }

  /**
   * Google Apps Script ব্যাকএন্ডের সাথে ব্যবহারকারীর প্রমাণীকরণ
   */
  async authenticate(username: string, password: string): Promise<AuthResponse> {
    console.log('Attempting authentication...', { username, scriptUrl: this.SCRIPT_URL });
    
    if (!this.SCRIPT_URL) {
      console.error('Google Apps Script URL not configured');
      return {
        success: false,
        message: 'Google Apps Script URL not configured. Please check the Configuration tab.',
      };
    }

    try {
      const requestUrl = `${this.SCRIPT_URL}?action=authenticate`;
      const requestBody = {
        username,
        password,
        timestamp: new Date().getTime(),
      };

      console.log('Making authentication request to:', requestUrl);
      console.log('Request body:', { ...requestBody, password: '[HIDDEN]' });

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          // CORS preflight রিকোয়েস্ট এড়াতে Content-Type কে text/plain এ পরিবর্তন করা হয়েছে
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Network response error:', errorText);
        throw new Error(`Network error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Authentication response:', result);

      if (result.success) {
        // ব্যাকএন্ড থেকে আসা ব্যবহারকারীর ডেটা নরমালাইজ করা হচ্ছে
        const user = result.user ?? result.data?.user;
        if (!user || !user.username) {
          console.error('Authentication successful but user data is missing or malformed in the response.', result);
          return {
            success: false,
            message: 'Authentication failed: Missing user data in response from the server.',
          };
        }
        
        // লোকাল সেশন টোকেন তৈরি করা হচ্ছে
        const sessionToken = this.generateSessionToken();
        const sessionData: SessionData = {
          sessionId: sessionToken,
          username: user.username,
          permissions: user.permissions || ['admin'],
          expiresAt: new Date().getTime() + this.SESSION_DURATION,
        };

        // সেশন ডেটা লোকালি সংরক্ষণ করা হচ্ছে
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
        console.log('Session created successfully');

        return {
          success: true,
          token: sessionToken,
          user,
        };
      }

      return {
        success: false,
        message: result.message || 'Authentication failed',
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error - please check your connection',
      };
    }
  }

  /**
   * বর্তমান সেশন বৈধ কিনা তা যাচাই করা
   */
  verifySession(): boolean {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return false;

      const session: SessionData = JSON.parse(sessionData);
      return new Date().getTime() < session.expiresAt;
    } catch (error) {
      return false;
    }
  }

  /**
   * বর্তমান ব্যবহারকারীর সেশন ডেটা নেওয়া
   */
  getCurrentSession(): SessionData | null {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;

      const session: SessionData = JSON.parse(sessionData);
      if (new Date().getTime() >= session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * ব্যবহারকারীর নির্দিষ্ট পারমিশন আছে কিনা তা পরীক্ষা করা
   */
  hasPermission(permission: string): boolean {
    const session = this.getCurrentSession();
    return session?.permissions.includes(permission) || session?.permissions.includes('admin') || false;
  }

  /**
   * ব্যবহারকারীকে লগআউট করা এবং সেশন পরিষ্কার করা
   */
  logout(): void {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    localStorage.removeItem('admin_user');
  }

  /**
   * একটি সুরক্ষিত সেশন টোকেন তৈরি করা
   */
  private generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Google Apps Script এ প্রমাণীকৃত অনুরোধ পাঠানো
   */
  async makeAuthenticatedRequest(action: string, data: any = {}): Promise<any> {
    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('No valid session found');
    }

    try {
      const response = await fetch(`${this.SCRIPT_URL}?action=${action}`, {
        method: 'POST',
        headers: {
          // CORS preflight রিকোয়েস্ট এড়াতে Content-Type কে text/plain এ পরিবর্তন করা হয়েছে
          'Content-Type': 'text/plain;charset=UTF-8',
          'Authorization': `Bearer ${session.sessionId}`,
        },
        body: JSON.stringify({
          ...data,
          sessionId: session.sessionId,
          timestamp: new Date().getTime(),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.error === 'INVALID_SESSION') {
        this.logout();
        throw new Error('Session expired - please login again');
      }

      return result;
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  }

  /**
   * Google Sheets থেকে অ্যাডমিন কনফিগারেশন নেওয়া
   */
  async getAdminConfig(): Promise<any> {
    return this.makeAuthenticatedRequest('getAdminConfig');
  }

  /**
   * Google Sheets এ অ্যাডমিন সেটিংস আপডেট করা
   */
  async updateAdminSettings(settings: any): Promise<any> {
    return this.makeAuthenticatedRequest('updateAdminSettings', { settings });
  }

  /**
   * Google Sheets থেকে অডিট লগ নেওয়া
   */
  async getAuditLogs(limit: number = 50): Promise<any> {
    return this.makeAuthenticatedRequest('getAuditLogs', { limit });
  }

  /**
   * অডিট ট্রেইলের জন্য অ্যাডমিন অ্যাকশন লগ করা
   */
  async logAction(action: string, details: any = {}): Promise<void> {
    try {
      await this.makeAuthenticatedRequest('logAction', {
        action,
        details,
        username: this.getCurrentSession()?.username,
      });
    } catch (error) {
      console.error('Failed to log action:', error);
      // এই ত্রুটি মূল ফাংশনালিতে বাধা দেবে না
    }
  }
}

export const googleAppsScriptAuth = new GoogleAppsScriptAuthService();
