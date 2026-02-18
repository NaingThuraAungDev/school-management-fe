import { Component, input, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

export type StatusType = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

@Component({
    selector: 'app-status-badge',
    imports: [MatChipsModule],
    template: `
    <span class="status-badge" [class]="statusClass()">
      {{ label() || status() }}
    </span>
  `,
    styles: [`
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;

      &.status-active {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.status-inactive {
        background: #fafafa;
        color: #616161;
      }

      &.status-pending {
        background: #fff3e0;
        color: #e65100;
      }

      &.status-approved {
        background: #e3f2fd;
        color: #1565c0;
      }

      &.status-rejected {
        background: #ffebee;
        color: #c62828;
      }

      &.status-completed {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.status-cancelled {
        background: #fafafa;
        color: #757575;
      }
    }
  `]
})
export class StatusBadgeComponent {
    status = input.required<StatusType | string>();
    label = input<string>();

    protected statusClass = computed(() => {
        const status = this.status().toLowerCase();
        return `status-${status}`;
    });
}
