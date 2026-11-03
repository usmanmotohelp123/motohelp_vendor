import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly TOKEN_KEY = 'token';
  constructor() {

  }

  setToken(token: string): void {
    console.log('Saving JWT token:', token);
    localStorage.setItem(this.TOKEN_KEY,token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
    // localStorage.removeItem('CustomerID');
    // localStorage.removeItem('CompanyName');
    // localStorage.removeItem('ContactPerson');
    // localStorage.removeItem('EmailID');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false;
      }
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return true;
    }
  }
  
  getCustomerId(): string | null {
    return localStorage.getItem('CustomerID');
  }

}

