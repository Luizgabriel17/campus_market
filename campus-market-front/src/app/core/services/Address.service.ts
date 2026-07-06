import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
  id: string;
  recipient?: string;
  phone?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  reference?: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/addresses`;

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  createAddress(data: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, data);
  }

  updateAddress(id: string, data: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${id}`, data);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}