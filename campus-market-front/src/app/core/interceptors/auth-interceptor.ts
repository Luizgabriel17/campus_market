import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Busca o token exatamente com a chave salva pelo seu AuthService
  const token = localStorage.getItem('campus_market_token');

  // Se o token existir, clona a requisição adicionando o cabeçalho Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};