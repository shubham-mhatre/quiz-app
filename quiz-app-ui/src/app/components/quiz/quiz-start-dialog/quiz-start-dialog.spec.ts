import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStartDialog } from './quiz-start-dialog';

describe('QuizStartDialog', () => {
  let component: QuizStartDialog;
  let fixture: ComponentFixture<QuizStartDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizStartDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizStartDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
