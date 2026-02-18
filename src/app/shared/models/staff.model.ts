// Staff models matching API

export enum StaffType {
    Teacher = 0,
    Admin = 1,
    Support = 2
}

export enum StaffRoleType {
    ClassTeacher = 0,
    HOD = 1,
    Admin = 2,
    SubjectTeacher = 3,
    Principal = 4
}

export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    qualification: string;
    joiningDate: string;
    staffType: StaffType;
    isActive: boolean;
    roles: StaffRole[];
}

export interface StaffRole {
    id: string;
    staffId: string;
    role: StaffRoleType;
    classSectionId?: string;
    classSectionName?: string;
}

// Request DTOs
export interface OnboardStaffRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    qualification: string;
    joiningDate: string;
    staffType: StaffType;
}

export interface UpdateStaffRequest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    qualification: string;
    staffType: StaffType;
    isActive: boolean;
}

export interface AssignStaffRoleRequest {
    staffId: string;
    role: StaffRoleType;
    classSectionId?: string;
    academicYearId: string;
}

export interface StaffFilter {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    staffType?: StaffType;
    isActive?: boolean;
}
