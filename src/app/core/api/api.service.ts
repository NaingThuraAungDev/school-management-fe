import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
    observe?: 'body';
    reportProgress?: boolean;
    withCredentials?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    /**
     * GET request
     */
    get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
    }

    /**
     * GET request as Promise
     */
    async getAsync<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return firstValueFrom(this.get<T>(endpoint, options));
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options);
    }

    /**
     * POST request as Promise
     */
    async postAsync<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
        return firstValueFrom(this.post<T>(endpoint, body, options));
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, options);
    }

    /**
     * PUT request as Promise
     */
    async putAsync<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
        return firstValueFrom(this.put<T>(endpoint, body, options));
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, options);
    }

    /**
     * PATCH request as Promise
     */
    async patchAsync<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
        return firstValueFrom(this.patch<T>(endpoint, body, options));
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);
    }

    /**
     * DELETE request as Promise
     */
    async deleteAsync<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return firstValueFrom(this.delete<T>(endpoint, options));
    }

    /**
     * Upload file
     */
    upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Observable<T> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
            reportProgress: true
        });
    }

    /**
     * Upload multiple files
     */
    uploadMultiple<T>(endpoint: string, files: File[], additionalData?: Record<string, any>): Observable<T> {
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file, file.name);
        });

        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
            reportProgress: true
        });
    }

    /**
     * Download file
     */
    downloadFile(endpoint: string, filename?: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${endpoint}`, {
            responseType: 'blob'
        });
    }

    /**
     * Build query params from object
     */
    buildParams(params: Record<string, any>): HttpParams {
        let httpParams = new HttpParams();

        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== null && value !== undefined) {
                httpParams = httpParams.set(key, value.toString());
            }
        });

        return httpParams;
    }
}
