import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quiz-start-dialog',
  standalone: false,
  templateUrl: './quiz-start-dialog.html',
  styleUrl: './quiz-start-dialog.scss',
})
export class QuizStartDialog {

  numberOfQuestions: number = 10; // Default value for questions

  constructor(
    private dialogRef: MatDialogRef<QuizStartDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { topicId: number }
  ) {}

  startQuiz() {
    if (this.numberOfQuestions > 0) {
      this.dialogRef.close(this.numberOfQuestions); // Pass the number of questions to the parent component
    } else {
      alert('Please select a valid number of questions');
    }
  }
}
