import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { QuestionManagement } from './components/question-management/question-management';
import { TopicManagement } from './components/topic-management/topic-management';
import { authguardGuard } from '../guards/authguard-guard';
import { roleguardGuard } from '../guards/roleguard-guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboard
  },
  {
    path: 'topics',
    component: TopicManagement,
    canActivate: [authguardGuard, roleguardGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'users',
    component: UserManagement
  },
  {
    path: 'questions',
    component: QuestionManagement
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
