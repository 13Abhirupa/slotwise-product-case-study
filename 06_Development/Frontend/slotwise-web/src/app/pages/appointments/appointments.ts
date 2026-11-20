import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, switchMap } from 'rxjs';

interface Customer {
  customerId: string;
  fullName: string;
  phone?: string;
}

interface Staff {
  staffId: string;
  fullName: string;
  employmentStatus?: string;
}

interface SalonService {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price?: number;
}

interface Appointment {
  appointmentId: string;
  customerId?: string | null;
  staffId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  bookingSource: string;
  customer?: Customer;
}

interface CurrentUser {
  businessId: string;
}

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  private http = inject(HttpClient);

  selectedDate = signal(this.localDate());
  showCreate = signal(false);
  selectedAppointment = signal<Appointment | null>(null);

  appointments = signal<Appointment[]>([]);
  customers = signal<Customer[]>([]);
  staff = signal<Staff[]>([]);
  services = signal<SalonService[]>([]);

  businessId = '';
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  form = this.emptyForm();

  filteredAppointments = computed(() =>
    this.appointments().filter(a =>
      String(a.appointmentDate).slice(0, 10) === this.selectedDate()
    )
  );

  ngOnInit() {
    this.loadData();
  }

  private localDate(): string {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  private emptyForm() {
    return {
      customerId: '',
      staffId: '',
      serviceId: '',
      date: this.selectedDate(),
      time: '',
      bookingSource: 'WALK_IN',
      notes: '',
    };
  }

  loadData() {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      user: this.http.get<CurrentUser>('/api/auth/me'),
      appointments: this.http.get<Appointment[]>('/api/appointments'),
      customers: this.http.get<Customer[]>('/api/customers'),
      staff: this.http.get<Staff[]>('/api/staff'),
      services: this.http.get<SalonService[]>('/api/services'),
    }).subscribe({
      next: data => {
        this.businessId = data.user.businessId;
        this.appointments.set(data.appointments);
        this.customers.set(data.customers);
        this.staff.set(data.staff);
        this.services.set(data.services);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(
          `Unable to load appointment data (HTTP ${err.status || 'network error'}).`
        );
        this.loading.set(false);
      },
    });
  }

  loadAppointments() {
    this.loadData();
  }

  customerName(a: Appointment): string {
    return a.customer?.fullName
      ?? this.customers().find(c => c.customerId === a.customerId)?.fullName
      ?? 'Walk-in Customer';
  }

  customerPhone(a: Appointment): string {
    return a.customer?.phone
      ?? this.customers().find(c => c.customerId === a.customerId)?.phone
      ?? '—';
  }

  staffName(a: Appointment): string {
    return this.staff().find(s => s.staffId === a.staffId)?.fullName ?? '—';
  }

  openCreate() {
    this.error.set('');
    this.success.set('');
    this.form = this.emptyForm();
    this.showCreate.set(true);
  }

  closeCreate() {
    if (!this.saving()) this.showCreate.set(false);
  }

  viewAppointment(a: Appointment) {
    this.selectedAppointment.set(a);
  }

  closeDetails() {
    this.selectedAppointment.set(null);
  }

  createAppointment() {
    if (this.saving()) return;

    const selectedService = this.services().find(
      s => s.serviceId === this.form.serviceId
    );

    if (!this.businessId || !this.form.staffId ||
        !selectedService || !this.form.date || !this.form.time) {
      this.error.set('Select a staff member, service, date and time.');
      return;
    }

    const duration = Number(selectedService.durationMinutes);

    if (!Number.isFinite(duration) || duration <= 0) {
      this.error.set('The selected service has an invalid duration.');
      return;
    }

    const [hours, minutes] = this.form.time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    if (endMinutes >= 1440) {
      this.error.set('The appointment must finish before midnight.');
      return;
    }

    const endTime =
      String(Math.floor(endMinutes / 60)).padStart(2, '0') +
      ':' +
      String(endMinutes % 60).padStart(2, '0');

    const appointmentPayload = {
      businessId: this.businessId,
      customerId: this.form.customerId || null,
      staffId: this.form.staffId,
      appointmentDate: this.form.date,
      startTime: this.form.time,
      endTime,
      appointmentStatus: 'CONFIRMED',
      bookingSource: this.form.bookingSource,
      notes: this.form.notes || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.http.post<Appointment>(
      '/api/appointments',
      appointmentPayload
    ).pipe(
      switchMap(appointment =>
        this.http.post('/api/appointment-services', {
          appointmentId: appointment.appointmentId,
          serviceId: selectedService.serviceId,
        })
      )
    ).subscribe({
      next: () => {
        this.saving.set(false);
        this.showCreate.set(false);
        this.selectedDate.set(this.form.date);
        this.success.set('Appointment saved successfully.');
        this.loadData();
      },
      error: err => {
        this.saving.set(false);
        this.error.set(
          `Unable to complete booking (HTTP ${err.status || 'network error'}). ` +
          (typeof err.error?.message === 'string' ? err.error.message : '')
        );
      },
    });
  }
}
