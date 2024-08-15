import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
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
  private authStatus = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    this.isAuthenticated().subscribe(isAuth => this.authStatus.next(isAuth));
  }
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
  // check status after Login
  checkAfterLogin() {
    this.checkAuthStatus(); // update auth status after login
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

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.authStatus.next(false);
  }
}
