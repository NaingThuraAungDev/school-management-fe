// Timetable models matching API

export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

export interface TimeSlot {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    sortOrder: number;
}

export interface TimetableEntry {
    id: string;
    classSectionId: string;
    classSectionName: string;
    subjectId: string;
    subjectName: string;
    staffId: string;
    staffName: string;
    timeSlotId: string;
    timeSlotName: string;
    dayOfWeek: DayOfWeek;
    academicYearId: string;
    room?: string;
}

// Request DTOs
export interface CreateTimeSlotRequest {
    name: string;
    startTime: string;
    endTime: string;
    sortOrder: number;
}

export interface CreateTimetableEntryRequest {
    classSectionId: string;
    subjectId: string;
    staffId: string;
    timeSlotId: string;
    dayOfWeek: DayOfWeek;
    academicYearId: string;
    room?: string;
}

export interface UpdateTimetableEntryRequest {
    id: string;
    classSectionId: string;
    subjectId: string;
    staffId: string;
    timeSlotId: string;
    dayOfWeek: DayOfWeek;
    room?: string;
}
