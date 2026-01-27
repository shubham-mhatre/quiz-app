import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})


export class AdminUser {
  
  private baseUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  createUser(payload: {
    username: string;
    password: string;
    role: 'USER';
  }): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload);
  }
  
}
