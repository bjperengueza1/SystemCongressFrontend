import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Congress {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class CongressService {
  private apiUrl = 'http://localhost:5196/api/Congresso'; // Endpoint de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de congresos y mapear propiedades
  getCongresses(): Observable<Congress[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response) =>
        response.map((item) => ({
          id: item.congressId,
          nombre: item.name,
          fechaInicio: item.startDate,
          fechaFin: item.endDate,
          ubicacion: item.location,
        }))
      )
    );
  }

  // Obtener un congreso por ID
  getCongress(id: number): Observable<Congress> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map((item) => ({
        id: item.congressId,
        nombre: item.name,
        fechaInicio: item.startDate,
        fechaFin: item.endDate,
        ubicacion: item.location,
      }))
    );
  }

  // Crear un congreso
  createCongress(congreso: Congress): Observable<any> {
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
  updateCongress(congreso: Congress): Observable<any> {
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
