import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Busca o token JWT salvo no localStorage após o login
  const token = localStorage.getItem('campus_market_token');

  // Se o token existir, clona a requisição adicionando o Header Authorization
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Se não houver token, envia a requisição original
  return next(req);
};