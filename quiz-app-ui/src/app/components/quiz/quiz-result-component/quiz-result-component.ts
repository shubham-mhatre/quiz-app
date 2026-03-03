import { Component } from '@angular/core';
import { Quizservice } from '../../../services/quizservice';
import { Router } from '@angular/router';

interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  results: { questionId: number; correct: boolean; score: number; correctOptionIds: number[] }[];
  topicId:number;
  quizAttemptId:number;
}

interface QuizReviewQuestion {
  id: number;
  questionText: string;
  options: { id: number; text: string }[];
  selectedOptionIds: number[];
  correctOptionIds: number[];
  explanation?: string;
}

@Component({
  selector: 'app-quiz-result-component',
  standalone: false,
  templateUrl: './quiz-result-component.html',
  styleUrl: './quiz-result-component.scss',
})
export class QuizResultComponent {

  summary!: QuizSummary;

  reviewMode = false;
  reviewQuestions: QuizReviewQuestion[] = [];

  constructor(private router: Router, private quizService: Quizservice) {
    // Get summary result from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as any;

    if (state?.results) {
      this.summary = state.results;
    }
  }

  ngOnInit(): void {}

  // ================== Review API ==================
  reviewQuiz() {
    if (!this.summary) return;

    this.quizService.fetchQuizReview(this.summary.quizAttemptId).subscribe(
      (questions: QuizReviewQuestion[]) => {
        this.reviewQuestions = questions;
        this.reviewMode = true; // toggle UI to detailed review
      },
      (error) => {
        console.error('Error fetching review:', error);
      }
    );
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  isOptionSelected(questionIndex: number, optionId: number): boolean {
    return this.reviewQuestions[questionIndex]?.selectedOptionIds.includes(optionId);
  }

  isOptionCorrect(questionIndex: number, optionId: number): boolean {
    return this.reviewQuestions[questionIndex]?.correctOptionIds.includes(optionId);
  }
}
