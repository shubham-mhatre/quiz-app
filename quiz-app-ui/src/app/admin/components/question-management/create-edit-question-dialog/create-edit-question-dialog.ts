import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../../../../models/question';

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
    @Inject(MAT_DIALOG_DATA) public data: { question?: Question }
  ) {
    this.form = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['SINGLE', Validators.required],
      explanation: [''],
      options: this.fb.array([])
    });

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
        questionText: ['', Validators.required],
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

    const payload: Question = {
      ...this.data?.question,
      questionText: this.form.value.text,
      questionType: this.form.value.questionType,
      explanation: this.form.value.explanation,
      options: options
    };

    // 🔔 send back to parent
    this.dialogRef.close(payload);
  }

  // ---------- patch for edit ----------
  private patchForm(question: Question): void {
    this.form.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      explanation: question.explanation
    });

    question.options.forEach(o => {
      this.options.push(
        this.fb.group({
          questionText: [o.text, Validators.required],
          correct: [o.correct]
        })
      );
    });
  }
}
