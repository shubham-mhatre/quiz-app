import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Questionservice {
  private baseUrl = 'http://localhost:8080';
  
  constructor(private http: HttpClient) {}

  getByTopic(topicId: number) {
    debugger;
    return this.http.get<Question[]>(
      `${this.baseUrl}/api/admin/questions/${topicId}/bytopic`
    );
  }

  create(payload: any) {
    return this.http.post<Question>(`${this.baseUrl}/api/admin/questions`, payload);
  }

  update(id: number, payload: any) {
    return this.http.put<Question>(
      `${this.baseUrl}/api/admin/questions/${id}`, payload
    );
  }

  getByTopicWithPagination(topicId: number, page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/admin/questions/${topicId}/bytopic?page=${page}&size=${size}`
    );
  }

  getQuestionById(questionId: number): Observable<Question> {
    debugger;
    return this.http.get<Question>(`${this.baseUrl}/api/admin/questions/${questionId}`);
  }
}
