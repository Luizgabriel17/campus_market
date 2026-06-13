import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Garante a detecção de eventos e atualizações de tela otimizadas
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Provedor de Rotas do Sistema
    provideRouter(routes),
    
    // Provedor para chamadas de API (Necessário para os Services funcionarem)
    provideHttpClient()
  ]
};