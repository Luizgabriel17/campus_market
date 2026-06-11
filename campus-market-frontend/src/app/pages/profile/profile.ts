import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getMe().subscribe((data) => {
      this.user = data;
    });
  }
}