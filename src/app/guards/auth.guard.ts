import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';

export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (!sessionService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (sessionService.isAdmin()) {
    return true;
  }

  router.navigate(['/blogs']);
  return false;
};