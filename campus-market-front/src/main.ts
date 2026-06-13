import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // Busca a classe AppComponent dentro do arquivo app.ts

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));