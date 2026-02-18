export enum UserRole {
    ADMIN = 'Admin',
    SUPER_ADMIN = 'SuperAdmin',
    TEACHER = 'Teacher',
    STUDENT = 'Student',
    PARENT = 'Parent'
}

export enum UserType {
    STUDENT = 'Student',
    STAFF = 'Staff',
    ADMIN = 'Admin',
    PARENT = 'Parent'
}

export interface User {
    email: string;
    userType: UserType;
    roles: string[];
    token: string;
    refreshToken: string;
    expiresAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    email: string;
    userType: string;
    roles: string[];
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ResetPasswordRequest {
    userId: string;
    newPassword: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
