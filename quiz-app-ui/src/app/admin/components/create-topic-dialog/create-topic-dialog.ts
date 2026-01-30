import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Topicservice } from '../../../services/topicservice';

@Component({
  selector: 'app-create-topic-dialog',
  standalone: false,
  templateUrl: './create-topic-dialog.html',
  styleUrl: './create-topic-dialog.scss',
})
export class CreateTopicDialog {
  form!: FormGroup;

  

  constructor(
    private fb: FormBuilder,
    private topicService: Topicservice,
    private dialogRef: MatDialogRef<CreateTopicDialog>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.topicService.createTopic(this.form.value)
      .subscribe(topic => this.dialogRef.close(topic));
  }
}
