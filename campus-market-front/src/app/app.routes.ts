import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { AuthCallbackComponent } from './features/auth/pages/auth-callback/auth-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
];