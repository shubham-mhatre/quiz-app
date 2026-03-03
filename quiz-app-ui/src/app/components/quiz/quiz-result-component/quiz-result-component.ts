import { Component } from '@angular/core';
import { Quizservice } from '../../../services/quizservice';
import { Router } from '@angular/router';

interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  results: {
    questionId: number;
    correct: boolean;
    score: number;
    correctOptionIds: number[];
  }[];
  topicId: number;
  attemptId: number;
}

interface QuizReviewQuestion {
  questionText: string;
  options: { id: number; text: string }[];
  selectedOptions: { id: number; text: string }[];
  correctOptions: { id: number; text: string }[];
  explanation?: string;

  // Derived fields for easier UI checks
  selectedOptionIds: number[];
  correctOptionIds: number[];
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

  constructor(
    private router: Router,
    private quizService: Quizservice
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as any;

    if (state?.results) {
      this.summary = state.results;
    }
  }

  ngOnInit(): void {}

  // ================= SCORE PERCENTAGE =================
  get scorePercentage(): number {
    if (!this.summary?.totalQuestions) return 0;

    return Math.round(
      (this.summary.correctAnswers / this.summary.totalQuestions) * 100
    );
  }

  // ================= PERFORMANCE MESSAGE =================
  get performanceMessage(): string {
    const score = this.scorePercentage;

    if (score >= 85) return '🎉 Excellent Performance!';
    if (score >= 60) return '👍 Good Job!';
    if (score >= 40) return '🙂 Not Bad, Keep Improving!';
    return '📚 Keep Practicing!';
  }

  // ================= REVIEW API =================
  reviewQuiz() {
    if (!this.summary?.attemptId) return;

    this.quizService.fetchQuizReview(this.summary.attemptId).subscribe(
      (questions: any[]) => {

        this.reviewQuestions = questions.map(q => ({
          questionText: q.questionText,
          options: q.options || [],
          selectedOptions: q.selectedOptions || [],
          correctOptions: q.correctOptions || [],
          explanation: q.explanation,

          selectedOptionIds: (q.selectedOptions || []).map((o: any) => o.id),
          correctOptionIds: (q.correctOptions || []).map((o: any) => o.id)
        }));

        this.reviewMode = true;
      },
      (error) => {
        console.error('Error fetching review:', error);
      }
    );
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // ================= OPTION CHECKS =================
  isOptionSelected(questionIndex: number, optionId: number): boolean {
    return this.reviewQuestions[questionIndex]?.selectedOptionIds.includes(optionId);
  }

  isOptionCorrect(questionIndex: number, optionId: number): boolean {
    return this.reviewQuestions[questionIndex]?.correctOptionIds.includes(optionId);
  }

  // ================= QUESTION STATUS =================
  isQuestionCorrect(question: QuizReviewQuestion): boolean {

    if (!question.selectedOptionIds?.length) return false;

    return (
      question.selectedOptionIds.length === question.correctOptionIds.length &&
      question.selectedOptionIds.every(id =>
        question.correctOptionIds.includes(id)
      )
    );
  }
}
