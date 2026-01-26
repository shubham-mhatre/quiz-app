import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { QuestionManagement } from './components/question-management/question-management';
import { BulkUpload } from './components/bulk-upload/bulk-upload';
import { MaterialModule } from '../material/material-module';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    AdminDashboard,
    UserManagement,
    QuestionManagement,
    BulkUpload,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminModule { }
