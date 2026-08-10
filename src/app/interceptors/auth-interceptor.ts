import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');

  if (token) {

    const authReq = req.clone({
      setHeaders: {
        Token: token
      }
    });
    return next(authReq);
  }

  return next(req);
};
