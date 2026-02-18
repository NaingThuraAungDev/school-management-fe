// Promotion models matching API

export interface PromotionPreview {
    id: string;
    studentName: string;
    rollNumber: string;
    currentClassSection: string;
    isEligible: boolean;
    reason?: string;
}

export interface BulkPromoteRequest {
    fromClassSectionId: string;
    toClassSectionId: string;
    fromAcademicYearId: string;
    toAcademicYearId: string;
    studentIds: string[];
}

export interface BulkPromoteResponse {
    promotedCount: number;
}
