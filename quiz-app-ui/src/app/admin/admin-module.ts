import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { QuestionManagement } from './components/question-management/question-management';
import { MaterialModule } from '../material/material-module';
import { SharedModule } from '../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopicManagement } from './components/topic-management/topic-management';
import { CreateTopicDialog } from './components/create-topic-dialog/create-topic-dialog';
import { CreateEditQuestionDialog } from './components/question-management/create-edit-question-dialog/create-edit-question-dialog';
import { QuestionDetailDialog } from './components/question-management/question-detail-dialog/question-detail-dialog';
import { UploadDialogComponent } from './components/question-management/upload-dialog-component/upload-dialog-component';



@NgModule({
  declarations: [
    AdminDashboard,
    UserManagement,
    QuestionManagement,
    TopicManagement,
    CreateTopicDialog,
    CreateEditQuestionDialog,
    QuestionDetailDialog,
    UploadDialogComponent,
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
