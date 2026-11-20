import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Customer {
  customerId: string;
  fullName?: string;
  customerName?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  customerEmail?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers implements OnInit {
  private http = inject(HttpClient);

  customers = signal<Customer[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal('');
  selectedCustomer = signal<Customer | null>(null);

  filteredCustomers = computed(() => {
    const query = this.search().toLowerCase().trim();

    return this.customers().filter(customer =>
      [
        this.name(customer),
        this.phone(customer),
        this.email(customer),
      ].some(value => value.toLowerCase().includes(query))
    );
  });

  ngOnInit() {
    this.loadCustomers();
  }

  name(customer: Customer): string {
    return customer.fullName ?? customer.customerName ?? '—';
  }

  phone(customer: Customer): string {
    return customer.phoneNumber ?? customer.phone ?? '—';
  }

  email(customer: Customer): string {
    return customer.email ?? customer.customerEmail ?? '—';
  }

  loadCustomers() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Customer[]>('/api/customers').subscribe({
      next: data => {
        if (!Array.isArray(data)) {
          this.error.set('Unexpected customer API response.');
          this.customers.set([]);
        } else {
          this.customers.set(data);
        }
        this.loading.set(false);
      },
      error: err => {
        this.error.set(
          `Unable to load customers (HTTP ${err.status || 'network error'}).`
        );
        this.loading.set(false);
      },
    });
  }

  viewCustomer(customer: Customer) {
    this.selectedCustomer.set(customer);
  }

  closeDetails() {
    this.selectedCustomer.set(null);
  }
}
