# School Management Frontend - AI Coding Guidelines

## Project Overview

This is an Angular 21 school management system frontend built with standalone components. The project uses modern Angular patterns including signals-based state management, lazy-loaded routes, and Material Design components.

**Tech Stack:**
- Angular 21 + TypeScript 5.9
- Material Design 21
- NGRx Signals for state management
- Vitest for unit testing
- SCSS for styling
- Reactive Forms for form handling

## Code Style & Structure

### Component Structure

All components are **standalone** with inline templates and styles. Follow this pattern:

```typescript
@Component({
  selector: 'app-component-name',
  imports: [CommonModule, MatButtonModule, ...],
  template: `
    <div class="container">
      <!-- Use @if, @for, @switch control flow syntax (NOT *ngIf, *ngFor) -->
      @if (condition()) {
        <p>Content</p>
      }
    </div>
  `,
  styles: [`
    .container { /* Use SCSS nesting */ }
  `]
})
export class ComponentNameComponent {
  // Use signals for all component state
  protected readonly state = signal<State | null>(null);
  protected readonly loading = signal(false);
  
  // Use computed for derived state
  protected readonly isEmpty = computed(() => !this.state());
}
```

**Key patterns:**
- Use `signal()` for mutable state, `input()` for component inputs, `output()` for component outputs
- Use `computed()` for derived/reactive values
- Use built-in control flow: `@if`, `@for`, `@switch` (Angular 17+)
- Component selectors use `app-` prefix
- Inline templates use single quotes for strings
- Protect private/internal properties with `protected`/`private` keywords

### Service Patterns

**Data Services** (`src/app/shared/services/`):
- API calls via `HttpClient`
- Return observables directly (let components/stores handle subscription)
- Include typed requests/responses

```typescript
@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  
  getStudents(filter: StudentFilter): Observable<PaginatedResponse<Student>> {
    return this.http.post<PaginatedResponse<Student>>('students/list', filter);
  }
}
```

**State Management** using NGRx Signals (`src/app/features/*/services/*store.ts`):

```typescript
export const StudentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    filteredStudents: computed(() => state.students()),
    isLoading: computed(() => state.loading()),
  })),
  withMethods((store, studentService = inject(StudentService)) => ({
    loadStudents: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => studentService.getStudents(store.filter())),
        catchError((error) => {
          patchState(store, { loading: false, error });
          return of([]);
        })
      )
    ),
  }))
);
```

**Core Services** (`src/app/core/`):
- `AuthService`: Authentication state, login/logout, token management
- `LoadingService`: Global loading indicators
- `NotificationService`: Toast/snackbar messages
- Use simple `signal()`-based state, not full signal stores

### HTTP Interceptors

Located in `src/app/core/api/` and `src/app/core/auth/`:

- **authInterceptor**: Adds Authorization header with JWT token, handles 401 responses
- **errorHandler**: Processes API errors, triggers notifications

## Architecture

### Folder Structure

```
src/app/
├── core/                    # Singleton services, auth, layout
│   ├── api/                 # HTTP interceptors
│   ├── auth/                # Authentication (service, guard, interceptor)
│   ├── layout/              # Main layout components (layout, header, sidebar)
│   └── services/            # Global services (loading, notification, confirm dialog)
├── features/                # Feature modules (routed)
│   ├── auth/                # Login component
│   ├── dashboard/           # Dashboard
│   ├── students/            # Students feature
│   │   ├── models/          # StudentFilter, Student interfaces
│   │   ├── services/        # StudentService, StudentStore
│   │   └── student-*/       # Feature components (list, detail, admission, etc.)
│   └── staff/               # Similar structure to students
├── shared/                  # Reusable across features
│   ├── components/          # DataTable, PageHeader, ConfirmDialog, etc.
│   ├── directives/          # Common directives (e.g., click-outside, highlight)
│   ├── models/              # Shared interfaces (common.model.ts, exam.model.ts, etc.)
│   ├── pipes/               # Custom pipes
│   └── services/            # Domain services (ClassService, ExamService, etc.)
└── environments/            # Config per environment
```

### Data Flow

1. **Route** → Component loads
2. **Component** injects Store and calls `store.loadData()`
3. **Store** uses rxMethod to trigger API call via Service
4. **Service** calls HttpClient → API
5. **Interceptors** (auth, error) process request/response
6. **Store** updates state (patchState) → signals update
7. **Component** reads signals via `store.data()` → template updates automatically

### Routing

- Lazy-loaded routes with `loadComponent` and `loadChildren`
- Feature routes in `<feature>.routes.ts` files
- Auth guards: `authGuard` (requires login), `guestGuard` (redirects if logged in)

Example:
```typescript
// app.routes.ts
{
  path: 'students',
  loadChildren: () => import('./features/students/students.routes')
}

// features/students/students.routes.ts
export default [
  { path: '', loadComponent: () => import('./student-list/...').then(m => m.StudentListComponent) }
];
```

## Forms & Validation

- Use **Reactive Forms** with `FormBuilder`
- Validate on form submit, not per-field
- Show validation errors after field is touched or form is submitted

```typescript
protected form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]]
});

protected onSubmit(): void {
  if (this.form.invalid) return;
  // Submit...
}
```

## UI Components & Styling

### Material Components
- Import what you use from `@angular/material/*`
- Standard: MatButtonModule, MatInputModule, MatTableModule, MatPaginatorModule, MatCardModule, etc.

### Shared UI Components

See [src/app/shared/components/](src/app/shared/components/):
- **DataTable**: Reusable table with sorting, pagination, actions — use `input()` and `output()`
- **PageHeader**: Title + subtitle + icon with breadcrumb support
- **ConfirmDialog**: Service-based confirmation dialogs
- **EmptyState**: Standardized empty state UI
- **FileUpload**: File upload with preview
- **StatusBadge**: Status indicator (colors based on status)

### Styles

- **Global**: `src/styles.scss` (imports from `styles/` folder)
- **Variables**: `_variables.scss` (colors, spacing, shadows)
- **Mixins**: `_mixins.scss` (common patterns, responsive breakpoints)
- **Typography**: `_typography.scss` (font families, sizes)
- Component styles: inline in `styles: [...]` array with SCSS nesting

Breakpoints (from mixins):
- `@media (max-width: 600px)` - mobile
- `@media (max-width: 960px)` - tablet
- `@media (max-width: 1200px)` - small desktop

## Common Models & Interfaces

Located in `src/app/shared/models/`:

- **common.model.ts**: `ApiResponse<T>`, `PaginatedResponse<T>`, `TableColumn<T>`, `SelectOption<T>`
- **student.model.ts**: Student, StudentFilter, Gender, GuardianRelationship enums
- **staff.model.ts**: Staff, StaffFilter, StaffType enums
- **exam.model.ts**, **class.model.ts**, **timetable.model.ts**, etc.

## Build & Test

### Development Server
```bash
npm start
# or
ng serve
# Runs on http://localhost:4200
```

### Build
```bash
npm run build        # Production build
npm run watch        # Watch mode
```

### Testing
```bash
npm test             # Vitest runner
# Vitest configuration in angular.json or package.json
# Tests: **/*.spec.ts files alongside source
```

### Code Style
```bash
# Prettier (built-in via package.json config)
npm run prettier     # Format files
# Prettier configs:
printWidth: 100
singleQuote: true
```

## Authentication & Security

### Auth Flow
1. User submits login form → `AuthService.login()`
2. Service makes POST to `/auth/login` → receives JWT tokens + user
3. `authInterceptor` automatically adds token to subsequent requests
4. Component injects `AuthService` and checks `authService.isAuthenticated()` signal

### Guards
- `authGuard`: Checks if authenticated, redirects to login if not
- `guestGuard`: Redirects to dashboard if already logged in

### Tokens
- Access token stored in signal and localStorage
- Refresh token stored in localStorage (for refresh logic if needed)
- 401 responses trigger auto-logout

## Common Patterns & Best Practices

### Component Initialization
```typescript
export class MyComponent {
  private studentStore = inject(StudentStore);
  
  ngOnInit(): void {
    this.studentStore.loadStudents();
  }
}
```

### Handling Errors
- API errors go through `errorHandler` interceptor
- Component reads error from store signal and displays via NotificationService
- Use snackbar/toast for user feedback

### Pagination & Filtering
- Store maintains filter state: `{ pageNumber, pageSize, searchTerm, ...}`
- Update filter via `store.updateFilter()` → triggers reload
- DataTable emits `pageChange` and `sortChange` outputs

### Empty States
- Use `<app-empty-state>` for lists with no data
- Provide icon, title, message, optional action button

### Performance
- Lazy load feature modules
- Use `trackBy` in `@for` loops: `@for (item of items; track item.id)`
- Unsubscribe from manual subscriptions or use `takeUntilDestroyed()`
- Store-based queries are preferrable to multiple service calls

### Accessibility
- Use semantic HTML (button, nav, main, etc.)
- Provide aria labels for icons
- Ensure keyboard navigation works
- Color is not the only indicator of status

## Integration Points

### API Communication
- Base URL: Set in `environment.ts` and `environment.prod.ts`
- All requests go through `HttpClient` interceptors
- Error handling centralized in `error-handler.interceptor.ts`

### Environment Configuration
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Project Conventions

### Naming
- **Files**: kebab-case (e.g., `student-list.component.ts`)
- **Classes**: PascalCase (e.g., `StudentListComponent`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Selectors**: app-* prefix (e.g., `app-student-list`)

### Imports
- Group by: Angular → Material → RxJS → Project
- Use absolute paths from `src/app/`

### Comments
- Document **why**, not what
- Use JSDoc for public methods
- Add comments for non-obvious logic

### File Organization
- One component per file
- Related types in same file or dedicated `.model.ts` file
- Services in dedicated `services/` folder

## Future Considerations

- Placeholder routes exist for: classes, timetable, exams, promotions, profile, settings
- These should be replaced with actual feature implementations
- Follow existing patterns when implementing new features
