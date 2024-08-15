import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://dummyjson.com/auth';

  constructor(private http: HttpClient) {}

  login(requestData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, requestData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  getCurrentUser(){
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/me`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`})
    }).pipe(
      catchError(error => {
        console.error('Error during getting user:', error);
        return  of(null);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => !!user), // Return true if user exists, false otherwise
      catchError(() => of(false)) // Return false if an error occurs
    );
  }
}
