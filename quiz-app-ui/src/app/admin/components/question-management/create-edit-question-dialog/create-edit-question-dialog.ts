import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../../../../models/question';
import { Questionservice } from '../../../../services/questionservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-edit-question-dialog',
  standalone: false,
  templateUrl: './create-edit-question-dialog.html',
  styleUrl: './create-edit-question-dialog.scss',
})
export class CreateEditQuestionDialog {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEditQuestionDialog>,
    private questionservice:Questionservice,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { question?: Question, topicId?:number }
  ) {
    this.form = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['SINGLE', Validators.required],
      explanation: [''],
      options: this.fb.array([])
    });
    debugger;
    if (data?.question) {
      this.patchForm(data.question);
    } else {
      this.addOption();
      this.addOption();
    }
  }

  // ---------- getters ----------
  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  // ---------- option helpers ----------
  addOption(): void {
    this.options.push(
      this.fb.group({
        text: ['', Validators.required],
        correct: [false]
      })
    );
  }

  onCorrectChange(index: number): void {
    if (this.form.value.questionType === 'SINGLE') {
      this.options.controls.forEach((ctrl, i) => {
        if (i !== index) {
          ctrl.get('correct')?.setValue(false, { emitEvent: false });
        }
      });
    }
  }

  // ---------- save ----------
  save(): void {
    debugger;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const options = this.form.value.options;

    const correctCount = options.filter((o: any) => o.correct).length;

    if (correctCount === 0) {
      alert('Please select at least one correct option');
      return;
    }

    if (this.form.value.questionType === 'SINGLE' && correctCount > 1) {
      alert('Single choice question can have only one correct answer');
      return;
    }
    debugger;
    const payload: Question = {
      ...this.data?.question,
      topicId: this.data?.topicId,
      questionText: this.form.value.questionText,
      questionType: this.form.value.questionType,
      explanation: this.form.value.explanation,
      options: options,
      message:''
      // topicId: this.form.value.topicId
    };

    if (this.data?.question?.id) {
      // It's an existing question - Update
      this.updateQuestion(this.data.question.id, payload);
    } else {
      // It's a new question - Create
      this.createQuestion(payload);
    }
  }

  // ---------- patch for edit ----------
  private patchForm(question: Question): void {
    this.form.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      explanation: question.explanation
    });

    // Patch options array
    question.options.forEach(o => {
      this.options.push(
        this.fb.group({
          text: [o.text, Validators.required],
          correct: [o.correct]
        })
      );
    });

    // if (this.data?.topicId) {
    //   this.form.addControl('topicId', this.fb.control(this.data.topicId));
    // }
  }

  removeOption(index: number): void {
    const options = this.form.get('options') as FormArray;
    options.removeAt(index);
  }

  // Call the create API for new questions
  private createQuestion(payload: Question): void {
    debugger;
    this.questionservice.create(payload).subscribe(
      (createdQuestion) => {
        this.snackBar.open(createdQuestion.message, 'Close', { duration: 3000 });
        this.dialogRef.close(createdQuestion);
      },
      (error) => {
        alert('Error creating question');
      }
    );
  }

// Call the update API for existing questions
  private updateQuestion(id: number, payload: Question): void {
    this.questionservice.update(id, payload).subscribe(
      (updatedQuestion) => {
        this.dialogRef.close(updatedQuestion);
      },
      (error) => {
        alert('Error updating question');
      }
    );
  }

}
