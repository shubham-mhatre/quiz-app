import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Questionservice } from '../../../../services/questionservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-dialog-component',
  standalone: false,
  templateUrl: './upload-dialog-component.html',
  styleUrl: './upload-dialog-component.scss',
})
export class UploadDialogComponent {
selectedFile: File | null = null;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private questionService: Questionservice,
    private snackBar: MatSnackBar,
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.errorMessage = null;
  }

  onUpload() {
    if (!this.selectedFile) {
      this.errorMessage = "Please select a file to upload.";
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    // Call the upload method from the questionService
    this.questionService.uploadCSV(formData).subscribe(
      (response) => {
        debugger;
        this.loading = false;
        this.snackBar.open(response, 'Close', { duration: 3000 });
        this.dialogRef.close(response);  // Return response or success message
      },
      (error) => {
        this.loading = false;
        this.errorMessage = "Error uploading the file. Please try again.";
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
