import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    LoginRequest,
    LoginResponse,
    User,
    UserRole,
    ChangePasswordRequest,
    ResetPasswordRequest
} from './auth.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // State
    private _currentUser = signal<User | null>(this.getUserFromStorage());
    private _accessToken = signal<string | null>(this.getAccessToken());
    private _isLoading = signal(false);
    private _error = signal<string | null>(null);

    // Public signals
    readonly currentUser = this._currentUser.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed
    readonly isAuthenticated = computed(() =>
        this._currentUser() !== null && this._accessToken() !== null
    );

    readonly userRoles = computed(() => this._currentUser()?.roles || []);
    readonly userType = computed(() => this._currentUser()?.userType || null);

    constructor() {
        // Initialize from storage
        this.initializeFromStorage();
    }

    async login(credentials: LoginRequest): Promise<void> {
        try {
            this._isLoading.set(true);
            this._error.set(null);

            const response = await firstValueFrom(
                this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
            );

            this.setAuthData(response);
            await this.router.navigate(['/dashboard']);
        } catch (error: any) {
            this._error.set(error.error?.message || 'Login failed');
            throw error;
        } finally {
            this._isLoading.set(false);
        }
    }

    async logout(): Promise<void> {
        try {
            // Optionally call logout endpoint
            await firstValueFrom(
                this.http.post(`${environment.apiUrl}/auth/logout`, {
                    refreshToken: this.getRefreshToken()
                })
            );
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
            await this.router.navigate(['/login']);
        }
    }

    async changePassword(request: ChangePasswordRequest): Promise<void> {
        await firstValueFrom(
            this.http.post(`${environment.apiUrl}/auth/change-password`, request)
        );
    }

    async resetPassword(request: ResetPasswordRequest): Promise<void> {
        await firstValueFrom(
            this.http.post(`${environment.apiUrl}/auth/reset-password`, request)
        );
    }

    hasRole(role: string): boolean {
        return this._currentUser()?.roles.includes(role) || false;
    }

    hasAnyRole(roles: string[]): boolean {
        const userRoles = this._currentUser()?.roles || [];
        return roles.some(role => userRoles.includes(role));
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    private setAuthData(response: LoginResponse): void {
        const user: User = {
            email: response.email,
            userType: response.userType as any,
            roles: response.roles,
            token: response.token,
            refreshToken: response.refreshToken,
            expiresAt: response.expiresAt
        };

        localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        this._accessToken.set(response.token);
        this._currentUser.set(user);
    }

    private clearAuthData(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        this._accessToken.set(null);
        this._currentUser.set(null);
    }

    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem(USER_KEY);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch {
                return null;
            }
        }
        return null;
    }

    private initializeFromStorage(): void {
        const token = this.getAccessToken();
        const user = this.getUserFromStorage();

        if (token && user) {
            this._accessToken.set(token);
            this._currentUser.set(user);
        }
    }
}
