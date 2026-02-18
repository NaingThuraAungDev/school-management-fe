import { Component, input, output, signal, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-form-field class="search-field" [appearance]="appearance()">
      <mat-icon matIconPrefix>search</mat-icon>
      <input 
        matInput 
        [formControl]="searchControl"
        [placeholder]="placeholder()"
        type="text"
      />
      @if (searchControl.value) {
        <button 
          matSuffix 
          mat-icon-button 
          (click)="clear()"
          type="button"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
  styles: [`
    .search-field {
      width: 100%;
    }
  `]
})
export class SearchInputComponent {
  placeholder = input<string>('Search...');
  debounceTime = input<number>(300);
  appearance = input<'fill' | 'outline'>('outline');

  searchChange = output<string>();

  protected searchControl = new FormControl('');

  constructor() {
    // Subscribe to search control changes with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchChange.emit(value || '');
      });
  }

  protected clear(): void {
    this.searchControl.setValue('');
  }
}
