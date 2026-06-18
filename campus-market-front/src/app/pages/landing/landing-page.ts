import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {

    const user = this.authService.getCurrentUser?.();

    if (user) {
      if (user.role === 'VENDEDOR') {
        this.router.navigate(['/vendedor/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }
}