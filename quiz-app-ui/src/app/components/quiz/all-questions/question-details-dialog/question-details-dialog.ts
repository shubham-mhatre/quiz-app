import { Component, Inject, OnInit } from '@angular/core';
import { Question } from '../../../../models/question';
import { Questionservice } from '../../../../services/questionservice';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-question-details-dialog',
  standalone: false,
  templateUrl: './question-details-dialog.html',
  styleUrl: './question-details-dialog.scss',
})
export class QuestionDetailsDialog implements OnInit {

  question!: Question;
  loading = true;

  selectedOptionId: number | null = null;     // for SINGLE
  selectedOptionIds: number[] = [];           // for MULTI
  checkedAnswer = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private questionService: Questionservice
  ) { }

  ngOnInit(): void {

    this.questionService.getQuestionById(this.data.questionId)
      .subscribe(res => {
        this.question = res;
        this.loading = false;
      });

  }

  toggleOption(optionId: number) {

    if (this.question.questionType === 'MULTIPLE') {

      if (this.selectedOptionIds.includes(optionId)) {
        this.selectedOptionIds =
          this.selectedOptionIds.filter(id => id !== optionId);
      } else {
        this.selectedOptionIds.push(optionId);
      }

    } else {
      this.selectedOptionId = optionId;
    }

  }

  checkAnswer() {
    this.checkedAnswer = true;
  }

  isCorrect(option: any) {
    return this.checkedAnswer && option.correct;
  }

  isWrong(option: any) {

    if (!this.checkedAnswer) return false;

    if (this.question.questionType === 'MULTIPLE') {
      return this.selectedOptionIds.includes(option.id!) && !option.correct;
    }

    return this.selectedOptionId === option.id! && !option.correct;
  }
}
