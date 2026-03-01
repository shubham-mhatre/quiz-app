import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Quizservice } from '../../../services/quizservice';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-quizcomponent',
  standalone: false,
  templateUrl: './quizcomponent.html',
  styleUrl: './quizcomponent.scss',
})
export class Quizcomponent implements OnInit,OnDestroy{

  topicId: number = 0;
  numberOfQuestions: number = 0;
  questions: any[] = []; // Store the fetched questions
  loading: boolean = false;

  currentQuestionIndex: number = 0;
  timeLeft: number = 0;  // Total time for the quiz (in seconds)
  totalTime: number = 0; // Total time for the entire quiz in seconds (number of questions * 90)
  timerSubscription: any;
  isQuizFinished: boolean = false;
  questionStatus: string[] = []; // Track attempted or not for each question

  questionButtons: number[] = [];
  attemptedQuestions: Set<number> = new Set();
  topicName='';

  constructor(private route: ActivatedRoute,private quizService:Quizservice,
    private router: Router,private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Capture query parameters passed from the DashboardComponent
    this.route.queryParams.subscribe(params => {
      this.topicId = params['topicId'];
      this.numberOfQuestions = params['numberOfQuestions'];
      this.questionButtons = Array.from({ length: this.numberOfQuestions }, (_, i) => i + 1);

      // Calculate the total time for the quiz (90 seconds per question)
      this.totalTime = this.numberOfQuestions * 90;
      this.timeLeft = this.totalTime;
      
      if (this.topicId && this.numberOfQuestions) {
        this.fetchQuestions();
      }
    });
  }

   ngOnDestroy() {
    if (this.timerSubscription) {
      clearInterval(this.timerSubscription);
    }
  }

  fetchQuestions() {
    this.loading = true;

    this.quizService.fetchQuizQuestions(this.topicId,this.numberOfQuestions)
    .subscribe((questions: any[]) => {
        this.loading = false;
        this.questions = questions; // Assign the fetched questions to the array
        this.startTimer();
      }, (error) => {
        this.loading = false;
        console.error(error);
      });
  }

  startTimer() {
    this.timerSubscription = setInterval(() => {
      this.timeLeft--; // Decrease the time

      // If time is up, automatically submit the quiz
      if (this.timeLeft <= 0) {
        this.finishQuiz();
      }
    }, 1000);
  }

  submitQuestion() {
    // Save the answer for the current question
    this.saveAnswer();

    // Check if the quiz is finished or move to the next question
    if (this.currentQuestionIndex === this.numberOfQuestions - 1) {
      this.finishQuiz();
    } else {
      this.currentQuestionIndex++;
    }
  }

  saveAnswer() {
    // Save the answer for the current question
    this.questionStatus[this.currentQuestionIndex] = 'attempted';
  }

  finishQuiz() {
    // Submit the quiz and redirect to results
    this.isQuizFinished = true;
    clearInterval(this.timerSubscription); // Stop the timer
    // Logic to finish and submit the quiz (e.g., call backend API)
    console.log("Quiz submitted!");
    // Redirect to results page or show results
    this.router.navigate(['/quiz-results']);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  navigateToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  markAsAttempted() {
    this.attemptedQuestions.add(this.currentQuestionIndex);
  }

  getButtonColor(index: number): string {
    if (this.attemptedQuestions.has(index)) {
      return 'green';
    }
    if (index === this.currentQuestionIndex) {
      return 'purple';  // Highlight current question in yellow
    }
    return 'grey';
  }

  getFormattedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  openSubmitConfirmation() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to submit the quiz before time runs out?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.submitQuiz(); // Proceed with submitting the quiz if confirmed
      }
    });
  }

  submitQuiz(){

  }

}
