export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface SelectOption<T = any> {
    label: string;
    value: T;
    disabled?: boolean;
    icon?: string;
}

export interface TableColumn<T = any> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
    format?: (value: any, row: T) => string;
}

export interface FilterCriteria {
    [key: string]: any;
}

export interface SortCriteria {
    column: string;
    direction: 'asc' | 'desc';
}

export interface PageEvent {
    pageIndex: number;
    pageSize: number;
    length: number;
}
