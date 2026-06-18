import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Adicionado 'withInterceptors'
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor'; // Importa o interceptor criado acima

export const appConfig: ApplicationConfig = {
  providers: [
    // Garante a detecção de eventos e atualizações de tela otimizadas
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Provedor de Rotas do Sistema
    provideRouter(routes),
    
    // Provedor para chamadas de API com a injeção automática de Tokens JWT
    provideHttpClient(
      withInterceptors([authInterceptor]) // A mágica acontece aqui!
    )
  ]
};