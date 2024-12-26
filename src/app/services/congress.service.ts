import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CongressItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
}

export interface ApiResponse {
  items: CongressItem[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CongressService {
  private apiUrl = 'http://localhost:5196/api/Congresso'; // Endpoint de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de congresos y mapear propiedades
  getCongresses(page: number, size: number): Observable<ApiResponse> {
    const params = { pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse>(`${this.apiUrl}`, { params });

  }

  // Obtener un congreso por ID
  getCongress(id: number): Observable<CongressItem> {
    return this.http.get<CongressItem>(`${this.apiUrl}/${id}`);
  }

  // Crear un congreso
  createCongress(congreso: any): Observable<any> {
    const payload = {
      congressId: congreso.id,
      name: congreso.nombre,
      startDate: congreso.fechaInicio,
      endDate: congreso.fechaFin,
      location: congreso.ubicacion,
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  // Actualizar un congreso
  updateCongress(congreso: any): Observable<any> {
    const url = `${this.apiUrl}/${congreso.id}`;
    const payload = {
      congressId: congreso.id,
      name: congreso.nombre,
      startDate: congreso.fechaInicio,
      endDate: congreso.fechaFin,
      location: congreso.ubicacion,
    };
    return this.http.put<any>(url, payload);
  }

  // Eliminar un congreso
  deleteCongress(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
