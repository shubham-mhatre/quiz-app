import { Component } from '@angular/core';
import { Topic } from '../../../models/topic';
import { Question } from '../../../models/question';
import { Topicservice } from '../../../services/topicservice';
import { Questionservice } from '../../../services/questionservice';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDetailDialog } from './question-detail-dialog/question-detail-dialog';
import { CreateEditQuestionDialog } from './create-edit-question-dialog/create-edit-question-dialog';


@Component({
  selector: 'app-question-management',
  standalone: false,
  templateUrl: './question-management.html',
  styleUrl: './question-management.scss',
})
export class QuestionManagement {

  topics: Topic[] = [];
  selectedTopicId!: number;
  questions: Question[] = [];
  loading = false;

  displayedColumns = ['text', 'type', 'actions'];

  constructor(
    private topicService: Topicservice,
    private questionService: Questionservice,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.topicService.getTopics().subscribe(t => this.topics = t);
  }

  loadQuestions() {
    if (!this.selectedTopicId) return;

    this.loading = true;
    this.questionService.getByTopic(this.selectedTopicId)
      .subscribe(q => {
        this.questions = q;
        this.loading = false;
      });
  }

  viewQuestion(q: Question) {
    this.dialog.open(QuestionDetailDialog, {
      width: '600px',
      data: q
    });
  }

  editQuestion(q: Question) {
    this.openCreateEditDialog(q);
  }

  createQuestion() {
    this.openCreateEditDialog();
  }

  private openCreateEditDialog(question?: Question) {
    const ref = this.dialog.open(CreateEditQuestionDialog, {
      width: '700px',
      data: { question, topicId: this.selectedTopicId }
    });

    ref.afterClosed().subscribe(saved => {
      if (saved) this.loadQuestions();
    });
  }
}
