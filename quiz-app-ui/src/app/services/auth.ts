import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LoginResponse {
  success: boolean;
  userId?: number;
  role?: string;
  username?:string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private readonly BASE_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.BASE_URL}/login`,
      { username, password }
    ).pipe(
      map(res => res ?? { success: false }),
      catchError(() => of({ success: false }))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  saveUser(user: LoginResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): LoginResponse | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  getUserId(): number | null {
    return this.getUser()?.userId ?? null;
  }

  getUserName(): string | null {
    return this.getUser()?.username ?? null;
  }
}
