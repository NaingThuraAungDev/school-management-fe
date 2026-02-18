// Subject models matching API

export interface Subject {
    id: string;
    name: string;
    code: string;
    description?: string;
}

export interface SubjectTeacherMapping {
    id: string;
    subjectId: string;
    subjectName: string;
    staffId: string;
    staffName: string;
    classSectionId: string;
    classSectionName: string;
    academicYearId: string;
}

// Request DTOs
export interface CreateSubjectRequest {
    name: string;
    code: string;
    description?: string;
}

export interface MapSubjectTeacherRequest {
    subjectId: string;
    staffId: string;
    classSectionId: string;
    academicYearId: string;
}
