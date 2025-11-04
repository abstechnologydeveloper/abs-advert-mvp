// utils/authStorage.ts
export interface UserCredentials {
  email: string;
  isEmail_verified: boolean;
  isProfileCompleted: boolean;
  remark: string;
  studentType: string;
  token: string;
  userId: string;
}

export class AuthStorage {
  private static tokenKey = "abs_token";
  private static userKey = "abs_user";

  // Save token and user credentials
  static setAuthData(userCredentials: UserCredentials) {
    localStorage.setItem(this.tokenKey, userCredentials.token);
    localStorage.setItem(this.userKey, JSON.stringify(userCredentials));
  }

  // Get token
  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get user info
  static getUser(): UserCredentials | null {
    const user = localStorage.getItem(this.userKey);
    return user ? (JSON.parse(user) as UserCredentials) : null;
  }

  // Delete both token and user info
  static clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
