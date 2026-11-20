import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface Business {
  businessId: string;
  businessName: string;
  status: string;
}

interface CurrentUser {
  userId: string;
  fullName: string;
  email: string;
  businessId: string;
  role: string;
}

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private http = inject(HttpClient);

  business = signal<Business | null>(null);
  currentUser = signal<CurrentUser | null>(null);
  loading = signal(false);
  saving = signal(false);
  editing = signal(false);
  error = signal('');
  success = signal('');

  form = {
    businessName: '',
    status: 'ACTIVE',
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<CurrentUser>('/api/auth/me').subscribe({
      next: user => {
        this.currentUser.set(user);

        if (!user.businessId) {
          this.loading.set(false);
          this.error.set('No business is linked to this account.');
          return;
        }

        this.http.get<Business>(
          `/api/businesses/${user.businessId}`
        ).subscribe({
          next: business => {
            this.business.set(business);
            this.loading.set(false);
          },
          error: err => {
            this.loading.set(false);
            this.error.set(
              `Unable to load business profile (HTTP ${err.status || 'network error'}).`
            );
          }
        });
      },
      error: err => {
        this.loading.set(false);
        this.error.set(
          `Unable to load account details (HTTP ${err.status || 'network error'}).`
        );
      }
    });
  }

  openEdit() {
    const business = this.business();
    if (!business) return;

    this.form = {
      businessName: business.businessName,
      status: business.status,
    };

    this.error.set('');
    this.success.set('');
    this.editing.set(true);
  }

  closeEdit() {
    if (!this.saving()) this.editing.set(false);
  }

  saveBusiness() {
    const business = this.business();
    if (!business || this.saving()) return;

    const businessName = this.form.businessName.trim();

    if (!businessName || businessName.length > 150) {
      this.error.set('Business name must contain 1–150 characters.');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.http.patch<Business>(
      `/api/businesses/${business.businessId}`,
      {
        businessName,
        status: this.form.status,
      }
    ).subscribe({
      next: updated => {
        this.business.set(updated);
        this.saving.set(false);
        this.editing.set(false);
        this.success.set('Business profile updated successfully.');
        this.loadSettings();
      },
      error: err => {
        this.saving.set(false);

        const message = err.error?.message;
        const details = Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string'
            ? message
            : 'Unable to update business profile.';

        this.error.set(`Update failed (HTTP ${err.status}): ${details}`);
      }
    });
  }
}
