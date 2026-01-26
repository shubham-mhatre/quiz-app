import { TestBed } from '@angular/core/testing';

import { Topicservice } from './topicservice';

describe('Topicservice', () => {
  let service: Topicservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Topicservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
