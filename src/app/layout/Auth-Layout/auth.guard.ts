import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // return true;

  const router = inject(Router);

  // Check if user is logged in
  const token = localStorage.getItem('token') || localStorage.getItem('user');

  if (token) {
    return true; // logged in → allow route
  } else {
    router.navigate(['/login']); // redirect to login
    return false; // block route
  }

};
