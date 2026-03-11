import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboardcomponent } from './components/dashboardcomponent/dashboardcomponent';
import { authguardGuard } from './guards/authguard-guard';
import { roleguardGuard } from './guards/roleguard-guard';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { Quizcomponent } from './components/quiz/quizcomponent/quizcomponent';
import { QuizResultComponent } from './components/quiz/quiz-result-component/quiz-result-component';
import { QuizHistory } from './components/quiz/quiz-history/quiz-history';
import { AllQuestions } from './components/quiz/all-questions/all-questions';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', 
    component: Dashboardcomponent, 
    canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  { path: 'quiz', component: Quizcomponent,
    canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  {
    path: 'quiz-results', component: QuizResultComponent,
    canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  {
    path: 'quiz-history', component: QuizHistory,
    // canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  {
    path: 'all-questions', component: AllQuestions,
    canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-module').then(m => m.AdminModule),
    canActivate: [authguardGuard,roleguardGuard],
    data: { role: 'ADMIN' }
  },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
