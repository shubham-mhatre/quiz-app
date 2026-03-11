import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllQuestions } from './all-questions';

describe('AllQuestions', () => {
  let component: AllQuestions;
  let fixture: ComponentFixture<AllQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
