import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Topic} from '../models/topic';

@Injectable({
  providedIn: 'root',
})
export class Topicservice {
  private baseUrl = 'http://localhost:8080/api/topics';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<Topic[]> {
    debugger;
    return this.http.get<Topic[]>(this.baseUrl);
  }

  createTopic(payload: any) {
    return this.http.post<Topic>(this.baseUrl, payload);
  }

  disableTopic(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/disable`, {});
  }
}
