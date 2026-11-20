import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

interface LoginResponse {
  accessToken?: string;
  access_token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal(
    !!sessionStorage.getItem('slotwise_access_token')
  );

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    }).pipe(
      map(response => {
        const token = response.accessToken ?? response.access_token;
        if (!token) {
          throw new Error('Login response did not contain an access token.');
        }
        return token;
      }),
      tap(token => {
        sessionStorage.setItem('slotwise_access_token', token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('slotwise_access_token');
    this.isAuthenticated.set(false);
    this.router.navigateByUrl('/login');
  }
}
