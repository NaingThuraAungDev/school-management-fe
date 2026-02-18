import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="app-icon">school</mat-icon>
            <h1>School Management System</h1>
            <p>Sign in to continue</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input 
                matInput 
                formControlName="email"
                type="email"
                autocomplete="email"
                autofocus
              />
              <mat-icon matPrefix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword.set(!hidePassword())"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="login-button"
              [disabled]="loginForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Sign In
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="footer-text">© 2026 School Management System</p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24px;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      text-align: center;
      width: 100%;
      padding: 24px 0;

      .app-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #1976d2;
        margin-bottom: 16px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 600;
        color: #212121;
      }

      p {
        margin: 0;
        color: #757575;
        font-size: 14px;
      }
    }

    mat-card-content {
      padding: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .remember-me {
      margin: 8px 0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      font-size: 14px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;

      mat-spinner {
        margin: 0 auto;
      }
    }

    mat-card-footer {
      padding: 16px 24px;
      background: #fafafa;
      border-top: 1px solid #e0e0e0;

      .footer-text {
        margin: 0;
        text-align: center;
        color: #9e9e9e;
        font-size: 12px;
      }
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    protected hidePassword = signal(true);
    protected isLoading = signal(false);
    protected errorMessage = signal<string | null>(null);

    protected loginForm: FormGroup;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    protected async onSubmit(): Promise<void> {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set(null);

            try {
                await this.authService.login(this.loginForm.value);
            } catch (error: any) {
                this.errorMessage.set(error.error?.message || 'Invalid username or password');
            } finally {
                this.isLoading.set(false);
            }
        }
    }
}
