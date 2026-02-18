// Enums matching API
export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2
}

export enum GuardianRelationship {
    Father = 0,
    Mother = 1,
    Guardian = 2,
    Other = 3
}

export enum DocumentType {
    BirthCertificate = 0,
    PreviousRecords = 1,
    TransferCertificate = 2,
    Photo = 3,
    Other = 4
}

// DTOs matching API response
export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    email: string;
    phone: string;
    address: string;
    rollNumber: string;
    admissionId: string;
    admissionDate: string;
    isActive: boolean;
    classSectionId: string;
    classSectionName: string;
    guardians: Guardian[];
    documents: StudentDocument[];
}

export interface Guardian {
    id?: string;
    studentId?: string;
    name: string;
    mobile: string;
    email?: string;
    relationship: GuardianRelationship;
    address?: string;
    occupation?: string;
    isPrimaryContact: boolean;
}

export interface StudentDocument {
    id?: string;
    studentId?: string;
    documentType: DocumentType;
    fileName: string;
    filePath: string;
    uploadedBy?: string;
    uploadedAt?: string;
}

// Request DTOs
export interface AdmitStudentRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    email: string;
    password: string;
    phone: string;
    address: string;
    classSectionId: string;
    academicYearId: string;
}

export interface UpdateStudentRequest {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    email: string;
    phone: string;
    address: string;
    classSectionId: string;
    isActive: boolean;
}

export interface LinkGuardianRequest {
    studentId: string;
    name: string;
    mobile: string;
    email?: string;
    relationship: GuardianRelationship;
    address?: string;
    occupation?: string;
    isPrimaryContact: boolean;
}

export interface UploadDocumentRequest {
    studentId: string;
    documentType: DocumentType;
    file: File;
}

export interface StudentFilter {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    classSectionId?: string;
    isActive?: boolean;
}
