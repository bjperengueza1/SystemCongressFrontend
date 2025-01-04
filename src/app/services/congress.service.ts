import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {CongressItem, RoomsItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root',
})
export class CongressService {
  private apiUrl = 'http://localhost:5196/api/Congress'; // Endpoint de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de congresos y mapear propiedades
  getCongresses(page: number, size: number): Observable<ApiResponse<CongressItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse<CongressItem>>(`${this.apiUrl}`, { params });
  }

  // Obtener un congreso por ID
  getCongress(id: number): Observable<CongressItem> {
    return this.http.get<CongressItem>(`${this.apiUrl}/${id}`);
  }

  // Crear un congreso
  createCongress(congress: CongressItem): Observable<any> {
    return this.http.post<any>(this.apiUrl, congress);
  }

  // Actualizar un congreso
  updateCongress(congress: CongressItem): Observable<any> {
    const url = `${this.apiUrl}/${congress.congressId}`;
    return this.http.put<any>(url, congress);
  }

  // Eliminar un congreso
  deleteCongress(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }

  //Obtener las salas de los congresos
  getRoomsByCongress(id: number,page: number, size: number): Observable<ApiResponse<RoomsItem>> {
    const params = {pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse<RoomsItem>>(`${this.apiUrl}/${id}/Rooms`, { params });
  }
}
