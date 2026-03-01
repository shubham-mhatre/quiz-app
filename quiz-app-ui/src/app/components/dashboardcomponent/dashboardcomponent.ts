import { Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import {Topic} from '../../models/topic';
import { Topicservice } from '../../services/topicservice';
import { MatDialog } from '@angular/material/dialog';
import { QuizStartDialog } from '../quiz/quiz-start-dialog/quiz-start-dialog';

@Component({
  selector: 'app-dashboardcomponent',
  standalone: false,
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.scss',
})
export class Dashboardcomponent implements OnInit{


  topics: Topic[] = [];
  loading = false;

  constructor(
    private router: Router,
    private auth: Auth,private topicService: Topicservice,
    private dialog:MatDialog
  ) {

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
    // this.router.navigate(['/quiz', topicId]);
    const dialogRef = this.dialog.open(QuizStartDialog, {
      width: '400px',
      data: { topicId } // Pass the topicId to the dialog
    });

    dialogRef.afterClosed().subscribe((numberOfQuestions: number) => {
      if (numberOfQuestions) {
        // Navigate to the quiz component with the topicId and numberOfQuestions
        this.router.navigate(['/quiz'], { queryParams: { topicId, numberOfQuestions } });
      }
    });
  }

  

}
