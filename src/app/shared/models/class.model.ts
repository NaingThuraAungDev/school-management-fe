// Class and Section models matching API

export interface Class {
    id: string;
    name: string;
    description?: string;
    sortOrder: number;
    sections: ClassSection[];
}

export interface Section {
    id: string;
    name: string;
    sortOrder: number;
}

export interface ClassSection {
    id: string;
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    academicYearId: string;
    capacity: number;
    studentCount: number;
}

// Request DTOs
export interface CreateClassRequest {
    name: string;
    sortOrder: number;
    description?: string;
}

export interface CreateSectionRequest {
    name: string;
    sortOrder: number;
}

export interface CreateClassSectionRequest {
    classId: string;
    sectionId: string;
    academicYearId: string;
    capacity: number;
}

export interface AcademicYear {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
