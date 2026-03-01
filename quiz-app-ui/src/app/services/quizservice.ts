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
    return this.httpClient.get<any[]>(`http://localhost:8080/api/quiz/questions?topicId=${topicId}&limit=${numberOfQuestions}`);
  }
  
}
