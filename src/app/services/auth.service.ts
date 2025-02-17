import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, ReplaySubject, throwError} from 'rxjs';

export interface LoginResponse {
  userId: number;
  name: string;
  email: string;
  role: number;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://34.173.148.212:5196/api/Account';
  private currentUserSource = new ReplaySubject<LoginResponse | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    this.checkLocalStorage();
  }

  //login
  login(email: string, password: string) : Observable<LoginResponse>{
    const credentials: LoginCredentials = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response: LoginResponse) => {
        if(response){
          this.storeUser(response);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private storeUser(user: LoginResponse){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  private checkLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      const userObject : LoginResponse = JSON.parse(user);
      this.currentUserSource.next(userObject);
    } else {
      this.currentUserSource.next(null);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.token : null;
  }

  hasRole(role: number): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Credenciales inválidas';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

}
