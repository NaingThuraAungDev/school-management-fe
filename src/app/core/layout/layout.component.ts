import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-layout',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        MatProgressBarModule,
        SidebarComponent,
        HeaderComponent
    ],
    template: `
    <div class="layout-container">
      @if (isLoading()) {
        <mat-progress-bar mode="indeterminate" class="loading-bar"></mat-progress-bar>
      }
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          #sidenav
          [mode]="sidenavMode()"
          [opened]="sidenavOpened()"
          class="sidenav"
        >
          <app-sidebar (closeSidebar)="closeSidebar()"></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content">
          <app-header (toggleSidebar)="toggleSidebar()"></app-header>
          
          <main class="main-content">
            <router-outlet />
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
    styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
    }

    .sidenav-container {
      flex: 1;
      overflow: hidden;
    }

    .sidenav {
      width: 260px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background-color: #f5f5f5;
    }

    @media (max-width: 960px) {
      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class LayoutComponent {
    private loadingService = inject(LoadingService);

    // State
    protected sidenavOpened = signal(true);
    protected sidenavMode = computed(() =>
        window.innerWidth > 960 ? 'side' : 'over'
    );

    // Loading indicator
    protected isLoading = this.loadingService.loading;

    protected toggleSidebar(): void {
        this.sidenavOpened.update(opened => !opened);
    }

    protected closeSidebar(): void {
        if (this.sidenavMode() === 'over') {
            this.sidenavOpened.set(false);
        }
    }
}
