import { Component,OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Auth } from '../../../services/auth';
import { Quizservice } from '../../../services/quizservice';
import { Router } from '@angular/router';

export interface QuizAttempt {
  attemptId: number;
  topic: string;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  submittedAt: string;
}

@Component({
  selector: 'app-quiz-history',
  standalone: false,
  templateUrl: './quiz-history.html',
  styleUrl: './quiz-history.scss',
})
export class QuizHistory {

   displayedColumns: string[] = [
    'attemptId',
    'topic',
    'totalQuestions',
    'correctCount',
    'startedAt',
    'submittedAt',
    'action'
  ];

  dataSource = new MatTableDataSource<QuizAttempt>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private quizService: Quizservice,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadHistory() {

    const userId = this.auth.getUserId();

    if (!userId) return;

    this.quizService.getQuizHistory(userId).subscribe(
      (data: QuizAttempt[]) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching quiz history', error);
      }
    );
  }

  reviewAttempt(attemptId: number) {
  this.router.navigate(['/quiz-results'], { state: { attemptId } });
}
}
