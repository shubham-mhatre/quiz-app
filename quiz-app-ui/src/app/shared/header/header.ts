import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  get username(): string {
    return this.auth.getUserName() ?? '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
