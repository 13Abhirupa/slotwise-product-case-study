import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface StaffMember {
  staffId: string;
  businessId: string;
  membershipId?: string | null;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  employmentStatus: string;
}

@Component({
  selector: 'app-staff',
  imports: [FormsModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})
export class Staff implements OnInit {
  private http = inject(HttpClient);

  staff = signal<StaffMember[]>([]);
  search = signal('');
  statusFilter = signal('ALL');
  loading = signal(false);
  error = signal('');
  selectedStaff = signal<StaffMember | null>(null);

  filteredStaff = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.staff().filter(member => {
      const matchesSearch = [
        member.fullName,
        member.phone ?? '',
        member.email ?? ''
      ].some(value => value.toLowerCase().includes(query));

      const matchesStatus =
        status === 'ALL' || member.employmentStatus === status;

      return matchesSearch && matchesStatus;
    });
  });

  activeCount = computed(() =>
    this.staff().filter(s => s.employmentStatus === 'ACTIVE').length
  );

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<StaffMember[]>('/api/staff').subscribe({
      next: data => {
        if (Array.isArray(data)) {
          this.staff.set(data);
        } else {
          this.staff.set([]);
          this.error.set('Unexpected response from the Staff API.');
        }

        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(
          `Unable to load staff (HTTP ${err.status || 'network error'}).`
        );
      }
    });
  }

  viewStaff(member: StaffMember) {
    this.selectedStaff.set(member);
  }

  closeDetails() {
    this.selectedStaff.set(null);
  }
}
