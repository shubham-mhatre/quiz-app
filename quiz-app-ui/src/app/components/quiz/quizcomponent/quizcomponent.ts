import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quizservice } from '../../../services/quizservice';

@Component({
  selector: 'app-quizcomponent',
  standalone: false,
  templateUrl: './quizcomponent.html',
  styleUrl: './quizcomponent.scss',
})
export class Quizcomponent implements OnInit{

  topicId: number = 0;
  numberOfQuestions: number = 0;
  questions: any[] = []; // Store the fetched questions
  loading: boolean = false;

  constructor(private route: ActivatedRoute,private quizService:Quizservice) {}

  ngOnInit() {
    // Capture query parameters passed from the DashboardComponent
    this.route.queryParams.subscribe(params => {
      this.topicId = params['topicId'];
      this.numberOfQuestions = params['numberOfQuestions'];
      
      if (this.topicId && this.numberOfQuestions) {
        this.fetchQuestions();
      }
    });
  }

  fetchQuestions() {
    this.loading = true;

    this.quizService.fetchQuizQuestions(this.topicId,this.numberOfQuestions)
    .subscribe((questions: any[]) => {
        this.loading = false;
        this.questions = questions; // Assign the fetched questions to the array
      }, (error) => {
        this.loading = false;
        console.error(error);
      });
  }

}
