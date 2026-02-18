import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface UploadedFile {
    file: File;
    preview?: string;
    uploading?: boolean;
    progress?: number;
}

@Component({
    selector: 'app-file-upload',
    imports: [MatIconModule, MatButtonModule, MatProgressBarModule],
    template: `
    <div class="file-upload-container">
      <div 
        class="drop-zone"
        [class.drag-over]="isDragOver()"
        [class.has-files]="files().length > 0"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          [accept]="accept()"
          [multiple]="multiple()"
          (change)="onFileSelect($event)"
          hidden
        />

        @if (files().length === 0) {
          <div class="drop-zone-content">
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p class="upload-text">
              {{ dragDropText() }}
            </p>
            <button mat-stroked-button type="button">
              Choose File{{ multiple() ? 's' : '' }}
            </button>
            @if (hint()) {
              <p class="upload-hint">{{ hint() }}</p>
            }
          </div>
        } @else {
          <div class="file-list">
            @for (uploadedFile of files(); track uploadedFile.file.name) {
              <div class="file-item">
                @if (isImage(uploadedFile.file) && uploadedFile.preview) {
                  <img 
                    [src]="uploadedFile.preview" 
                    alt="Preview" 
                    class="file-preview-image"
                  />
                } @else {
                  <mat-icon class="file-icon">{{ getFileIcon(uploadedFile.file) }}</mat-icon>
                }
                
                <div class="file-info">
                  <p class="file-name">{{ uploadedFile.file.name }}</p>
                  <p class="file-size">{{ formatFileSize(uploadedFile.file.size) }}</p>
                  
                  @if (uploadedFile.uploading) {
                    <mat-progress-bar 
                      mode="determinate" 
                      [value]="uploadedFile.progress || 0"
                    ></mat-progress-bar>
                  }
                </div>

                <button 
                  mat-icon-button 
                  (click)="removeFile(uploadedFile); $event.stopPropagation()"
                  type="button"
                >
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            }
          </div>
        }
      </div>

      @if (error()) {
        <p class="error-message">{{ error() }}</p>
      }
    </div>
  `,
    styles: [`
    .file-upload-container {
      width: 100%;
    }

    .drop-zone {
      border: 2px dashed #bdbdbd;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;

      &:hover {
        border-color: #757575;
        background: #f5f5f5;
      }

      &.drag-over {
        border-color: #1976d2;
        background: #e3f2fd;
      }

      &.has-files {
        padding: 16px;
      }
    }

    .drop-zone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
    }

    .upload-text {
      margin: 0;
      font-size: 16px;
      color: #616161;
    }

    .upload-hint {
      margin: 0;
      font-size: 12px;
      color: #9e9e9e;
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .file-preview-image {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 4px;
    }

    .file-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #757575;
    }

    .file-info {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .file-name {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      margin: 0;
      font-size: 12px;
      color: #757575;
    }

    .error-message {
      margin: 8px 0 0;
      padding: 8px 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      font-size: 14px;
    }
  `]
})
export class FileUploadComponent {
    accept = input<string>('*/*');
    multiple = input<boolean>(false);
    maxSize = input<number>(5 * 1024 * 1024); // 5MB default
    dragDropText = input<string>('Drag & drop files here or click to browse');
    hint = input<string>('');

    filesChange = output<File[]>();

    protected files = signal<UploadedFile[]>([]);
    protected isDragOver = signal(false);
    protected error = signal<string | null>(null);

    protected onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(true);
    }

    protected onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);
    }

    protected onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);

        const files = event.dataTransfer?.files;
        if (files) {
            this.handleFiles(Array.from(files));
        }
    }

    protected onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
            input.value = ''; // Reset input
        }
    }

    protected removeFile(uploadedFile: UploadedFile): void {
        this.files.update(files => files.filter(f => f !== uploadedFile));
        this.emitFiles();
    }

    private handleFiles(newFiles: File[]): void {
        this.error.set(null);

        // Validate file size
        const oversizedFiles = newFiles.filter(f => f.size > this.maxSize());
        if (oversizedFiles.length > 0) {
            this.error.set(`Some files exceed the maximum size of ${this.formatFileSize(this.maxSize())}`);
            return;
        }

        const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
            file,
            preview: this.isImage(file) ? URL.createObjectURL(file) : undefined
        }));

        if (this.multiple()) {
            this.files.update(files => [...files, ...uploadedFiles]);
        } else {
            this.files.set(uploadedFiles.slice(0, 1));
        }

        this.emitFiles();
    }

    private emitFiles(): void {
        this.filesChange.emit(this.files().map(f => f.file));
    }

    protected isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }

    protected getFileIcon(file: File): string {
        const type = file.type;

        if (type.startsWith('image/')) return 'image';
        if (type.includes('pdf')) return 'picture_as_pdf';
        if (type.includes('word') || type.includes('document')) return 'description';
        if (type.includes('sheet') || type.includes('excel')) return 'table_chart';
        if (type.includes('presentation') || type.includes('powerpoint')) return 'slideshow';
        if (type.startsWith('video/')) return 'video_file';
        if (type.startsWith('audio/')) return 'audio_file';

        return 'insert_drive_file';
    }

    protected formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}
