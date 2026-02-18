import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    PromotionPreview,
    BulkPromoteRequest,
    BulkPromoteResponse
} from '../models/promotion.model';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {
    private api = inject(ApiService);
    private readonly endpoint = 'promotions';

    bulkPromoteStudents(request: BulkPromoteRequest): Observable<BulkPromoteResponse> {
        return this.api.post<BulkPromoteResponse>(`${this.endpoint}/bulk`, request);
    }

    getPromotionPreview(fromClassSectionId: string, academicYearId: string): Observable<PromotionPreview[]> {
        return this.api.get<PromotionPreview[]>(`${this.endpoint}/preview`, {
            params: { fromClassSectionId, academicYearId }
        });
    }
}
