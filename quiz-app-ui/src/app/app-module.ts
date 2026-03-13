import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material/material-module';
import { Login } from './components/login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Dashboardcomponent } from './components/dashboardcomponent/dashboardcomponent';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { SharedModule } from './shared/shared-module';
import { QuizStartDialog } from './components/quiz/quiz-start-dialog/quiz-start-dialog';
import { Quizcomponent } from './components/quiz/quizcomponent/quizcomponent';
import { ConfirmationDialog } from './components/confirmation-dialog/confirmation-dialog';
import { QuizResultComponent } from './components/quiz/quiz-result-component/quiz-result-component';
import { QuizHistory } from './components/quiz/quiz-history/quiz-history';
import { AllQuestions } from './components/quiz/all-questions/all-questions';
import { QuestionDetailsDialog } from './components/quiz/all-questions/question-details-dialog/question-details-dialog';
import { Studyquestioncomponent } from './components/quiz/studyquestioncomponent/studyquestioncomponent';


@NgModule({
  declarations: [
    App,
    Login,
    Dashboardcomponent,
    Unauthorized,
    QuizStartDialog,
    Quizcomponent,
    ConfirmationDialog,
    QuizResultComponent,
    QuizHistory,
    AllQuestions,
    QuestionDetailsDialog,
    Studyquestioncomponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
