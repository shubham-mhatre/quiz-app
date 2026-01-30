import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { QuestionManagement } from './components/question-management/question-management';
import { BulkUpload } from './components/bulk-upload/bulk-upload';
import { MaterialModule } from '../material/material-module';
import { SharedModule } from '../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopicManagement } from './components/topic-management/topic-management';
import { CreateTopicDialog } from './components/create-topic-dialog/create-topic-dialog';



@NgModule({
  declarations: [
    AdminDashboard,
    UserManagement,
    QuestionManagement,
    BulkUpload,
    TopicManagement,
    CreateTopicDialog,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminModule { }
