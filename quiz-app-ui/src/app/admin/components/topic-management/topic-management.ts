import { Component,OnInit } from '@angular/core';
import {Topic} from '../../../models/topic'; 
import { Topicservice } from '../../../services/topicservice';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateTopicDialog } from '../create-topic-dialog/create-topic-dialog';

@Component({
  selector: 'app-topic-management',
  standalone: false,
  templateUrl: './topic-management.html',
  styleUrl: './topic-management.scss',
})
export class TopicManagement implements OnInit{

  topics: Topic[] = [];
  loading = false;
  displayedColumns = ['name', 'description', 'status', 'actions'];

  constructor(
    private topicService: Topicservice,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;
    this.topicService.getTopics().subscribe({
      next: res => {
        this.topics = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTopicDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.topics = [result, ...this.topics];
        this.snackBar.open('Topic created', 'Close', { duration: 3000 });
      }
    });
  }

  disableTopic(topic: Topic): void {
    this.topicService.disableTopic(topic.id).subscribe(() => {
      topic.isActive = false;
      this.snackBar.open('Topic disabled', 'Close', { duration: 3000 });
    });
  }

}
