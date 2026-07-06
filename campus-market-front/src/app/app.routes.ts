import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing Page
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing-page')
        .then(m => m.LandingComponent)
  },

  // Autenticação
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(m => m.RegisterComponent)
  },

  // Cliente
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.HomeComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.CartComponent)
  },
  {
    path: 'my-orders',
    loadComponent: () =>
      import('./pages/my-orders/my-orders')
        .then(m => m.MyOrdersComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile')
        .then(m => m.ProfileComponent)
  },

  // Vendedor
  {
    path: 'vendedor/dashboard',
    loadComponent: () =>
      import('./pages/vendedor/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'vendedor/products-form',
    loadComponent: () =>
      import('./pages/vendedor/products-form/products-form')
        .then(m => m.ProductsFormComponent)
  },
  {
    path: 'vendedor/products',
    loadComponent: () =>
      import('./pages/vendedor/products/products')
        .then(m => m.SellerProductsComponent)
  },
  {
    path: 'vendedor/profile',
    loadComponent: () =>
      import('./pages/vendedor/profile/profile')
        .then(m => m.SellerProfileComponent)
  },

  // Página não encontrada
  {
    path: '**',
    redirectTo: ''
  }
];