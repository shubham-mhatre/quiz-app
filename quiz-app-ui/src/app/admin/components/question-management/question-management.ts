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

  displayedColumns = ['Sr No.','Question', 'Question type', 'Actions'];

  totalItems = 0;   // Total number of questions (for pagination)
  pageSize = 10;    // Number of items per page
  currentPage = 0;  // Current page index

  constructor(
    private topicService: Topicservice,
    private questionService: Questionservice,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.topicService.getTopics().subscribe(t => this.topics = t);
  }

  loadQuestions(page: number = 0) {
    if (!this.selectedTopicId) return;

    this.loading = true;
    this.questionService.getByTopicWithPagination(this.selectedTopicId, page, this.pageSize)
      .subscribe(response => {
        this.questions = response.content;  // `content` will contain the questions for the current page
        this.totalItems = response.totalElements;  // Total questions available
        this.loading = false;
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadQuestions(this.currentPage);
  }

  viewQuestion(q: Question) {
    // Fetch question details by ID before opening the modal
    debugger;
    if(q.id){
      this.questionService.getQuestionById(q.id).subscribe(questionDetails => {
        this.dialog.open(QuestionDetailDialog, {
          width: '600px',
          data: questionDetails // Pass full question details to the dialog
        });
      });
    }
  }

  editQuestion(q: Question) {
    //this.openCreateEditDialog(q);
    if (q.id) {
    this.questionService.getQuestionById(q.id).subscribe(questionDetails => {
      this.openCreateEditDialog(questionDetails);  // Pass the fetched data to the dialog
    });
  }
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
