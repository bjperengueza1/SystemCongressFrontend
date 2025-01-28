import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Si el backend responde con 401
        authService.logout(); // Opcional: Limpia el estado del usuario o tokens
        router.navigate(['/admin/login']); // Redirige al login
      }
      return throwError(() => error); // Propaga el error si es necesario
    })
  );
  //return next(req);
};
