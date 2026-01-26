
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleguardGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const expectedRole = route.data['role'] as 'ADMIN' | 'USER';

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!auth.hasRole(expectedRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
