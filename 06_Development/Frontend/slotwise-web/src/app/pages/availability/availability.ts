import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface StaffMember {
  staffId: string;
  fullName: string;
  employmentStatus?: string;
}

interface StaffSchedule {
  staffAvailabilityId?: string;
  availabilityId?: string;
  staffId: string;
  dayOfWeek?: number | string;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
  status?: string;
}

interface AvailabilityException {
  availabilityExceptionId?: string;
  exceptionId?: string;
  staffId: string;
  exceptionDate?: string;
  startDate?: string;
  endDate?: string;
  exceptionType?: string;
  type?: string;
  reason?: string;
  notes?: string;
}

@Component({
  selector: 'app-availability',
  imports: [FormsModule],
  templateUrl: './availability.html',
  styleUrl: './availability.scss',
})
export class Availability implements OnInit {
  private http = inject(HttpClient);

  staff = signal<StaffMember[]>([]);
  schedules = signal<StaffSchedule[]>([]);
  exceptions = signal<AvailabilityException[]>([]);

  selectedStaffId = signal('ALL');
  selectedSchedule = signal<StaffSchedule | null>(null);
  selectedException = signal<AvailabilityException | null>(null);

  loading = signal(false);
  error = signal('');

  days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];

  filteredSchedules = computed(() =>
    this.schedules().filter(s =>
      this.selectedStaffId() === 'ALL' ||
      s.staffId === this.selectedStaffId()
    ).sort((a, b) =>
      Number(a.dayOfWeek ?? 0) - Number(b.dayOfWeek ?? 0)
    )
  );

  filteredExceptions = computed(() =>
    this.exceptions().filter(e =>
      this.selectedStaffId() === 'ALL' ||
      e.staffId === this.selectedStaffId()
    )
  );

  ngOnInit() {
    this.loadAvailability();
  }

  loadAvailability() {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      staff: this.http.get<unknown>('/api/staff'),
      schedules: this.http.get<unknown>('/api/staff-availability'),
      exceptions: this.http.get<unknown>('/api/availability-exceptions'),
    }).subscribe({
      next: data => {
        if (
          !Array.isArray(data.staff) ||
          !Array.isArray(data.schedules) ||
          !Array.isArray(data.exceptions)
        ) {
          this.error.set('Unexpected API response format.');
          this.loading.set(false);
          return;
        }

        this.staff.set(data.staff);
        this.schedules.set(data.schedules);
        this.exceptions.set(data.exceptions);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(
          `Unable to load availability (HTTP ${err.status || 'network error'}).`
        );
      }
    });
  }

  staffName(id: string): string {
    return this.staff().find(s => s.staffId === id)?.fullName
      ?? 'Unknown Staff';
  }

  dayName(day?: number | string): string {
    if (day === undefined || day === null) return '—';

    const number = Number(day);

    if (Number.isInteger(number) && number >= 0 && number <= 6) {
      return this.days[number];
    }

    return String(day);
  }

  time(value?: string): string {
    return value ? String(value).slice(0, 5) : '—';
  }

  exceptionType(e: AvailabilityException): string {
    return e.exceptionType ?? e.type ?? '—';
  }

  exceptionDate(e: AvailabilityException): string {
    return e.exceptionDate ?? e.startDate ?? '—';
  }

  closeDetails() {
    this.selectedSchedule.set(null);
    this.selectedException.set(null);
  }
}
