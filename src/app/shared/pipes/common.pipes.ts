import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
        if (!value) return '';

        try {
            const date = typeof value === 'string' ? parseISO(value) : value;
            return format(date, formatStr);
        } catch {
            return '';
        }
    }
}

@Pipe({
    name: 'phone'
})
export class PhonePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        // Simple phone formatting (adjust based on your locale)
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length === 10) {
            return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
        }

        return value;
    }
}

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string | null | undefined, limit: number = 50, trail: string = '...'): string {
        if (!value) return '';

        if (value.length <= limit) {
            return value;
        }

        return value.substring(0, limit) + trail;
    }
}

@Pipe({
    name: 'initials'
})
export class InitialsPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        const parts = value.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
}
