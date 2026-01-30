import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class Questionservice {
  
  constructor(private http: HttpClient) {}

  getByTopic(topicId: number) {
    return this.http.get<Question[]>(
      `/api/admin/topics/${topicId}/questions`
    );
  }

  create(payload: any) {
    return this.http.post<Question>(`/api/admin/questions`, payload);
  }

  update(id: number, payload: any) {
    return this.http.put<Question>(
      `/api/admin/questions/${id}`, payload
    );
  }
}
