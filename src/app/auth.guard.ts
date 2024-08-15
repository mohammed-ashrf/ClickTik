// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { CanActivateFn, CanMatchFn } from '@angular/router';
import { map } from 'rxjs';

export const canActivate: CanActivateFn = () => {
  const authService = inject(LoginService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        authService.logout();
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const canMatch: CanMatchFn = () => {
  const authService = inject(LoginService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        authService.logout();
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
