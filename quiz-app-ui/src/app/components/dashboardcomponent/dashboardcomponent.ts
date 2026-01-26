import { Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import {Topic} from '../../models/topic';
import { Topicservice } from '../../services/topicservice';

@Component({
  selector: 'app-dashboardcomponent',
  standalone: false,
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.scss',
})
export class Dashboardcomponent implements OnInit{

  username = '';

  topics: Topic[] = [];
  loading = false;

  constructor(
    private router: Router,
    private auth: Auth,private topicService: Topicservice,
  ) {
    const user = this.auth.getUser();
    this.username = user?.username || '';
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;

    this.topicService.getTopics().subscribe({
      next: data => {
        this.topics = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  startQuiz(topicId: number): void {
    this.router.navigate(['/quiz', topicId]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
