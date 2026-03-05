import { Component,OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit{

  role:string='';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() ?? '';
  }

  get username(): string {
    return this.auth.getUserName() ?? '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  quizHistory() {
    this.router.navigate(['/quiz-history']);
  }

  backToDashboard(){
    this.router.navigate(['/dashboard']);
  }
}
