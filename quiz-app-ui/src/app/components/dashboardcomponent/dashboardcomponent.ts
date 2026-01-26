import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboardcomponent',
  standalone: false,
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.scss',
})
export class Dashboardcomponent {

  username = '';

  topics = [
    { id: 1, name: 'Java Basics', description: 'Core Java MCQs' },
    { id: 2, name: 'Spring Boot', description: 'Spring Boot fundamentals' },
    { id: 3, name: 'Angular', description: 'Angular concepts' }
  ];

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    const user = this.auth.getUser();
    this.username = user?.username || '';
  }

  startQuiz(topicId: number): void {
    this.router.navigate(['/quiz', topicId]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
