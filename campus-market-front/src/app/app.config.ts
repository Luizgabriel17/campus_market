import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importe este

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor'; // Vamos criar logo abaixo

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Habilita o cliente HTTP e já deixa preparado o interceptor de Token JWT
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};