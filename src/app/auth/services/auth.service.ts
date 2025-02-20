import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthStatus,
  CheckTokenResponse,
  LoginResponse,
  User,
} from '../interfaces';
import { Router } from '@angular/router';
import { JwtDecodeService } from './jwt-decode.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtDecodeService = inject(JwtDecodeService);

  //private _currentUser = signal<User | null>(null);
  //  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //public currentUser = computed(() => this._currentUser());
  //public authStatus = computed(() => this._authStatus());

  constructor() {
    //this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    //this._currentUser.set(user);
    //this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem(
      'expires',
      JSON.stringify(this.jwtDecodeService.decodeToken(token)['exp'])
    );

    console.log({
      expireDate: new Date(
        Number(this.jwtDecodeService.decodeToken(token)['exp']) * 1000
      ),
      currentDate: new Date(),
    });

    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  logout() {
    //this._currentUser.set(null);
    //this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.router.navigateByUrl('/auth/login');
  }

  // checkAuthStatus(): Observable<boolean> {
  //   const url = `${this.baseUrl}/auth/check-token`;
  //   const token = localStorage.getItem('token');

  //   console.log('SE EJECUTA EL CHECK');
  //   console.log({ token: token });

  //   if (!token) {
  //     this.logout();
  //     return of(false);
  //   }
  //   console.log('ENVIANDO CONSULTA DE CHECK');
  //   //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<CheckTokenResponse>(url).pipe(
  //     map(({ user, token }) => this.setAuthentication(user, token)),
  //     catchError((err) => {
  //       console.log({ error: err });
  //       this._authStatus.set(AuthStatus.notAuthenticated);
  //       return of(false);
  //     })
  //   );
  // }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/auth`;

    return this.http.get<User[]>(url).pipe(
      catchError((err) => {
        console.log({ error: err });
        return of();
      })
    );
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  getStorageUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  tokenHasExpired() {
    var convertDate = Number(localStorage.getItem('expires')) * 1000;
    var expireDate = new Date(convertDate);
    var currentDate = new Date();

    return currentDate > expireDate;
  }
}
