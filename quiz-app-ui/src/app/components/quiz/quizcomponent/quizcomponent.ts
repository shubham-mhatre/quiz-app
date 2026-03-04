import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quizservice } from '../../../services/quizservice';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-quizcomponent',
  standalone: false,
  templateUrl: './quizcomponent.html',
  styleUrls: ['./quizcomponent.scss']
})
export class Quizcomponent implements OnInit, OnDestroy {

  // ================= STATES =================
  readonly NOT_VISITED = 'NOT_VISITED';
  readonly VISITED = 'VISITED';
  readonly ATTEMPTED = 'ATTEMPTED';
  readonly REVIEW = 'REVIEW';

  topicId = 0;
  numberOfQuestions = 0;
  questions: any[] = [];

  currentQuestionIndex = 0;

  totalTime = 0;
  timeLeft = 0;
  formattedTime = '';

  timer: any;
  isQuizFinished = false;

  questionButtons: number[] = [];
  questionStates: string[] = [];
  buttonColors: string[] = [];

  selectedOptions = new Map<number, any[]>();

  // Counters
  attemptedCount = 0;
  reviewCount = 0;
  visitedCount = 0;
  notVisitedCount = 0;

  constructor(
    private route: ActivatedRoute,
    private quizService: Quizservice,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private authService: Auth
  ) { }

  // ================= INIT =================
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.topicId = +params['topicId'];
      this.numberOfQuestions = +params['numberOfQuestions'];

      this.questionButtons = Array.from(
        { length: this.numberOfQuestions },
        (_, i) => i
      );

      this.questionStates = Array(this.numberOfQuestions).fill(this.NOT_VISITED);

      this.totalTime = this.numberOfQuestions * 90;
      this.timeLeft = this.totalTime;

      this.updateFormattedTime();
      this.refreshUI();

      if (this.topicId && this.numberOfQuestions) {
        this.fetchQuestions();
      }
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  fetchQuestions() {
    this.quizService
      .fetchQuizQuestions(this.topicId, this.numberOfQuestions)
      .subscribe(questions => {
        this.questions = questions;
        this.startTimer();
        this.cd.markForCheck();
      });
  }

  // ================= TIMER =================
  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateFormattedTime();

      if (this.timeLeft <= 0) {
        this.submitQuiz(true); // auto submit
      }

      this.cd.markForCheck();
    }, 1000);
  }

  updateFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // ================= NAVIGATION =================
  navigateToQuestion(index: number) {
    this.currentQuestionIndex = index;

    if (this.questionStates[index] === this.NOT_VISITED) {
      this.questionStates[index] = this.VISITED;
    }

    this.refreshUI();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.navigateToQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.navigateToQuestion(this.currentQuestionIndex - 1);
    }
  }

  // ================= OPTION CHANGE =================
  onOptionChange(questionIndex: number, optionId: any, isChecked?: boolean) {

    if (this.questions[questionIndex]?.questionType === 'SINGLE') {
      this.selectedOptions.set(questionIndex, [optionId]);
    }

    if (this.questions[questionIndex]?.questionType === 'MULTIPLE') {

      let selected = this.selectedOptions.get(questionIndex) || [];

      if (isChecked) {
        selected = [...selected, optionId];
      } else {
        selected = selected.filter(id => id !== optionId);
      }

      this.selectedOptions.set(questionIndex, selected);
    }

    this.updateAttemptState(questionIndex);
  }

  updateAttemptState(index: number) {
    const selected = this.selectedOptions.get(index) || [];

    if (selected.length > 0) {
      this.questionStates[index] = this.ATTEMPTED;
    } else {
      this.questionStates[index] = this.VISITED;
    }

    this.refreshUI();
  }

  // ================= REVIEW =================
  markForReview() {
    this.questionStates[this.currentQuestionIndex] = this.REVIEW;
    this.refreshUI();
  }

  // ================= SUBMIT CONFIRMATION =================
  openSubmitConfirmation() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      disableClose: true,
      data: {
        message: 'Are you sure you want to submit the quiz before time runs out?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.submitQuiz(false); // manual submit
      }
    });
  }

  // ================= SUBMIT =================
  submitQuiz(isAutoSubmit: boolean) {
    if (this.isQuizFinished) return;

    clearInterval(this.timer);
    this.isQuizFinished = true;

    console.log(this.authService.getUser());
    let userId=this.authService.getUserId();
    // Prepare payload as per your API
    const payload = {
      userId: userId,
      topicId: this.topicId,
      answers: Array.from(this.selectedOptions.entries()).map(([questionIndex, optionIds]) => ({
        questionId: this.questions[questionIndex]?.id || questionIndex,
        selectedOptionIds: optionIds
      }))
    };
    
    console.log('Submitting quiz payload:', payload);

    // Call backend API
    this.quizService.submitQuiz(payload).subscribe(
      (response) => {
        console.log('Quiz submitted successfully!', response);

        // Redirect to results page or show result
        // Example: pass results via state
        this.router.navigate(['/quiz-results'], { state: { results: response } });
      },
      (error) => {
        console.error('Error submitting quiz:', error);
        // Optionally show a message to user
      }
    );
  }

  // ================= UI HELPERS =================
  refreshUI() {
    this.updateButtonColors();
    this.updateCounters();
    this.cd.markForCheck();
  }

  updateButtonColors() {
    this.buttonColors = this.questionStates.map(state => {
      if (state === this.ATTEMPTED) return 'green';
      if (state === this.REVIEW) return 'purple';
      if (state === this.VISITED) return 'dodgerblue';
      return 'lightgray';
    });
  }

  updateCounters() {
    this.attemptedCount = this.questionStates.filter(s => s === this.ATTEMPTED).length;
    this.reviewCount = this.questionStates.filter(s => s === this.REVIEW).length;
    this.visitedCount = this.questionStates.filter(s => s === this.VISITED).length;
    this.notVisitedCount = this.questionStates.filter(s => s === this.NOT_VISITED).length;
  }

  getSelectedOption(index: number) {
    return this.selectedOptions.get(index) || [];
  }
}
