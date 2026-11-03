
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const interceptorsInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log("token>>>>> ",token)

  // const token = localStorage.getItem('accessToken');
  if (req.url.includes('/send-otp') || req.url.includes('/verify-otp') || req.url.includes('/login')) {
    return next(req);
  }

   // No token
    if (!token) {
      return next(req);
    }

    // Check JWT expiry BEFORE API call
    if (authService.isTokenExpired(token)) {
      console.log('JWT token expired - logging out');
      localStorage.removeItem('accessToken');
      router.navigate(['/login']);
      return EMPTY;
    }

  // If token exists, add Authorization header
  if (token) {
      const authReq = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
     return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token expired / unauthorized
        if (error.status === 401) {
          console.log('JWT expired or unauthorized');
          localStorage.removeItem('accessToken');
          // authService.logout();
          router.navigate(['/login']);
        }
        // Forbidden
        if (error.status === 403) {
          console.log('Access forbidden');
          localStorage.removeItem('accessToken');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      }));
   }
  return next(req);
};