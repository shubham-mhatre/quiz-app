import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studyquestioncomponent } from './studyquestioncomponent';

describe('Studyquestioncomponent', () => {
  let component: Studyquestioncomponent;
  let fixture: ComponentFixture<Studyquestioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Studyquestioncomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Studyquestioncomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
