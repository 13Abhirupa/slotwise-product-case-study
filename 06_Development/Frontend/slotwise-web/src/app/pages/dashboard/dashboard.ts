import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface Appointment {
  appointmentId?: string;
  appointmentDate?: string;
  startTime?: string;
  status?: string;
  appointmentStatus?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);

  loading = signal(true);
  error = signal('');

  totalAppointments = signal<number | null>(null);
  todayAppointments = signal<number | null>(null);
  activeStaff = signal<number | null>(null);
  totalCustomers = signal<number | null>(null);

  appointments = signal<Appointment[]>([]);

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      appointments: this.http.get<Appointment[]>('/api/appointments'),
      staff: this.http.get<any[]>('/api/staff'),
      customers: this.http.get<any[]>('/api/customers'),
    }).subscribe({
      next: data => {
        const appointments = Array.isArray(data.appointments)
          ? data.appointments : [];
        const staff = Array.isArray(data.staff) ? data.staff : [];
        const customers = Array.isArray(data.customers)
          ? data.customers : [];

        const today = new Date();
        const localDate = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, '0'),
          String(today.getDate()).padStart(2, '0')
        ].join('-');

        this.totalAppointments.set(appointments.length);

        this.todayAppointments.set(
          appointments.filter(a =>
            a.appointmentDate?.slice(0, 10) === localDate
          ).length
        );

        this.activeStaff.set(
          staff.filter(s =>
            String(s.staffStatus ?? s.status ?? '').toUpperCase() === 'ACTIVE'
          ).length
        );

        this.totalCustomers.set(customers.length);
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(
          `Unable to load dashboard data (HTTP ${err.status || 'network error'}).`
        );
        this.loading.set(false);
      },
    });
  }
}
