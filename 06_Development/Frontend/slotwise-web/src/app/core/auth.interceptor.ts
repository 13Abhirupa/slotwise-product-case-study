import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('slotwise_access_token');

  if (token && req.url.startsWith('/api/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        req.url.startsWith('/api/') &&
        !req.url.includes('/auth/login')
      ) {
        sessionStorage.removeItem('slotwise_access_token');
        router.navigateByUrl('/login');
      }

      return throwError(() => error);
    })
  );
};
