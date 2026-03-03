import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Quizservice {

  private baseUrl = 'http://localhost:8080';
  
  constructor(private httpClient: HttpClient) {}

  fetchQuizQuestions(topicId:number,numberOfQuestions:number): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.baseUrl}/api/quiz/questions?topicId=${topicId}&limit=${numberOfQuestions}`);
  }

  submitQuiz(payload: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/quiz/submit`, payload);
  }

  fetchQuizReview(quizAttemptId:number): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/quiz/submit`, quizAttemptId);
  }
  
}
