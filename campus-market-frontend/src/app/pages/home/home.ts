import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MockDataService, Product } from '../../core/services/mock-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  userName = '';

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
  this.featuredProducts =
    this.mockData.getProducts().slice(0, 6);

  if (typeof window !== 'undefined') {
    const user =
      localStorage.getItem('user');

    if (user) {
      const userData = JSON.parse(user);

      this.userName =
        userData.email.split('@')[0];
    }
  }
}

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToProductDetail(id: number) {
    this.router.navigate(['/products', id]);
  }

  logout() {

  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  this.router.navigate(['/login']);
}
}

