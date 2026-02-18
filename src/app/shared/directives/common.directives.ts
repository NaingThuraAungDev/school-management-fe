import { Directive, input, effect, ElementRef, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Structural directive to show/hide elements based on user role
 * Usage: *appHasRole="[UserRole.ADMIN, UserRole.PRINCIPAL]"
 */
@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective {
    private authService = inject(AuthService);
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);

    appHasRole = input.required<string[]>();

    constructor() {
        effect(() => {
            const requiredRoles = this.appHasRole();
            const hasRole = this.authService.hasAnyRole(requiredRoles as any);

            if (hasRole) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        });
    }
}

/**
 * Autofocus directive
 * Usage: <input appAutofocus>
 */
@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective {
    private el = inject(ElementRef);

    constructor() {
        // Focus on next tick
        setTimeout(() => {
            this.el.nativeElement.focus();
        }, 0);
    }
}
