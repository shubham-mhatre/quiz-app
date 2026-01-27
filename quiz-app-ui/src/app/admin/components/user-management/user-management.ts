import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUser } from '../../../services/admin-user';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {

  users: User[] = [];
  loading = false;
  userForm: FormGroup;

  constructor(
    private adminUserService: AdminUser,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminUserService.getUsers().subscribe({
      next: res => {
        this.users = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  createUser(): void {
    if (this.userForm.invalid) return;

    const payload = {
      ...this.userForm.value,
      role: 'USER'
    };

    this.adminUserService.createUser(payload).subscribe({
      next: user => {
        this.users = [user, ...this.users]; 
        this.userForm.reset();
        this.snackBar.open(
        'User created successfully',
        'Close',
        { duration: 3000 }
      );
      }
    });
  }
}
