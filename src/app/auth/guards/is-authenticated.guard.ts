import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAuthToken();

  if (token && !authService.tokenHasExpired()) return true;
  //if (authService.authStatus() === AuthStatus.authenticated) return true;

  // const url = state.url;
  // localStorage.setItem('url', url);
  authService.logout();
  return false;
};
