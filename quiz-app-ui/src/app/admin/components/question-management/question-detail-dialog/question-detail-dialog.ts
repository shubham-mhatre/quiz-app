import { Component,Inject } from '@angular/core';
import { Question } from '../../../../models/question';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-question-detail-dialog',
  standalone: false,
  templateUrl: './question-detail-dialog.html',
  styleUrl: './question-detail-dialog.scss',
})
export class QuestionDetailDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Question,
    private dialogRef: MatDialogRef<QuestionDetailDialog>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
