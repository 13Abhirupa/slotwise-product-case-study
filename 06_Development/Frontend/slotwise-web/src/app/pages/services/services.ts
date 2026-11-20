import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface SalonService {
  serviceId: string;
  businessId?: string;
  serviceName?: string;
  name?: string;
  description?: string | null;
  durationMinutes?: number;
  duration?: number;
  price?: number | string | null;
  serviceStatus?: string;
  status?: string;
}

@Component({
  selector: 'app-services',
  imports: [FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {
  private http = inject(HttpClient);

  services = signal<SalonService[]>([]);
  search = signal('');
  statusFilter = signal('ALL');
  loading = signal(false);
  error = signal('');
  selectedService = signal<SalonService | null>(null);

  filteredServices = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.services().filter(service => {
      const matchesSearch = [
        this.serviceName(service),
        service.description ?? '',
      ].some(value => value.toLowerCase().includes(query));

      const matchesStatus =
        status === 'ALL' || this.serviceStatus(service) === status;

      return matchesSearch && matchesStatus;
    });
  });

  activeCount = computed(() =>
    this.services().filter(s => this.serviceStatus(s) === 'ACTIVE').length
  );

  ngOnInit() {
    this.loadServices();
  }

  serviceName(service: SalonService): string {
    return service.serviceName ?? service.name ?? 'Unnamed Service';
  }

  serviceStatus(service: SalonService): string {
    return service.serviceStatus ?? service.status ?? 'UNKNOWN';
  }

  duration(service: SalonService): string {
    const minutes = service.durationMinutes ?? service.duration;
    return minutes == null ? '—' : `${minutes} min`;
  }

  price(service: SalonService): string {
    if (service.price == null) return '—';
    const value = Number(service.price);
    return Number.isFinite(value) ? `₹${value.toFixed(2)}` : String(service.price);
  }

  loadServices() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<SalonService[]>('/api/services').subscribe({
      next: data => {
        if (Array.isArray(data)) {
          this.services.set(data);
        } else {
          this.services.set([]);
          this.error.set('Unexpected response from the Service API.');
        }
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(
          `Unable to load services (HTTP ${err.status || 'network error'}).`
        );
      },
    });
  }

  viewService(service: SalonService) {
    this.selectedService.set(service);
  }

  closeDetails() {
    this.selectedService.set(null);
  }
}
