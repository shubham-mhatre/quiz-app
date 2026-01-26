import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { QuestionManagement } from './components/question-management/question-management';
import { BulkUpload } from './components/bulk-upload/bulk-upload';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboard
  },
  {
    path: 'users',
    component: UserManagement
  },
  {
    path: 'questions',
    component: QuestionManagement
  },
  {
    path: 'bulk-upload',
    component: BulkUpload
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
