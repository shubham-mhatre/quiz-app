import { Component,OnInit } from '@angular/core';
import { Quizservice } from '../../../services/quizservice';
import { Topicservice } from '../../../services/topicservice';
import { Router } from '@angular/router';
import { Questionservice } from '../../../services/questionservice';
import { Topic } from '../../../models/topic';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDetailsDialog } from './question-details-dialog/question-details-dialog';

@Component({
  selector: 'app-all-questions',
  standalone: false,
  templateUrl: './all-questions.html',
  styleUrls: ['./all-questions.scss']
})
export class AllQuestions implements OnInit{

  topics: Topic[] = []; // List of available topics
  selectedTopicId: number = 0; // Selected topic
  questions: any[] = []; // List of questions for the selected topic
  totalQuestions: number = 0; // Total number of questions for pagination
  pageSize: number = 5; // Number of questions per page
  pageIndex: number = 0; // Current page index
  loading: boolean = false; // Loading state
  username: string = 'User'; // User name
  role: string = 'USER'; // User role

  constructor(private quizService: Quizservice, private router: Router,
    private questionservice :Questionservice,private topicService:Topicservice,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Fetch topics on component load
    this.fetchTopics();
  }

  fetchTopics() {
    this.topicService.getTopics().subscribe(t => this.topics = t);
  }

  onTopicChange(event: any) {
    if (this.selectedTopicId) {
      this.loading = true;
      this.questionservice.getByTopicWithPagination(this.selectedTopicId, this.pageIndex, this.pageSize)
        .subscribe((response) => {
          this.questions = response.content;  // Paginated questions (change according to your API response)
          this.totalQuestions = response.totalElements; // Total number of questions (change according to your API response)
          this.loading = false;
        });
    }
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onTopicChange({});  // Re-fetch the questions for the new page
  }

  checkDetails(questionId: number) {
    this.dialog.open(QuestionDetailsDialog, {
      width: '600px',
      data: { questionId: questionId }
    });
  }
}
