import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {CongressItem, ExposureItem, ListCongressCertificate, RoomsItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root',
})
export class CongressService {
  private apiUrl = 'http://34.173.148.212:8080/api/Congress'; // Endpoint de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de congresos y mapear propiedades
  getCongresses(page: number, size: number, search: string): Observable<ApiResponse<CongressItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<CongressItem>>(`${this.apiUrl}`, { params });
  }

  uploadFlayer(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload-flayer`, formData);
  }

  uploadConference(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload-template-certificate-conference`, formData);
  }

  uploadPonencia(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload-template-certificate-exposure`, formData);
  }

  uploadAttendance(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload-template-certificate-attendance`, formData);
  }

  // Obtener un congreso por ID
  getCongress(id: number): Observable<CongressItem> {
    return this.http.get<CongressItem>(`${this.apiUrl}/${id}`);
  }

  //Obtener un congreso por guid
  getCongressByGuid(guid: string): Observable<CongressItem> {
    return this.http.get<CongressItem>(`${this.apiUrl}/guid/${guid}`);
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

  searchCongresses(search: string): Observable<CongressItem[]> {
    const params = { search }
    return this.http
      .get<ApiResponse<CongressItem>>(`${this.apiUrl}`, { params })
      .pipe(
        map((response) => response.items || []),
        catchError(() => of([]))
      );
  }

  getListCertificates(dni: string): Observable<ListCongressCertificate[]> {
    return this.http.get<ListCongressCertificate[]>(`${this.apiUrl}/certificates/${dni}`);
  }

  downloadCertificateAttendance(id: number, dni:string) {
    return this.http.get(`${this.apiUrl}/certificate-attendance/${id}/${dni}`, {
      responseType: 'blob',
      observe: 'response' // Para acceder a headers y body
    });
  }
  downloadCertificateExposure(id: number, dni:string) {
    return this.http.get(`${this.apiUrl}/certificate-exposure/${id}/${dni}`, {
      responseType: 'blob',
      observe: 'response' // Para acceder a headers y body
    });
  }
  downloadCertificateConference(id: number, dni:string) {
    return this.http.get(`${this.apiUrl}/certificate-conference/${id}/${dni}`, {
      responseType: 'blob',
      observe: 'response' // Para acceder a headers y body
    });
  }

  activeCongress(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/active`, {});
  }

  getActiveCongress() : Observable<CongressItem> {
    return this.http.get<CongressItem>(`${this.apiUrl}/active`);
  }

  getFlayerActiveCongress() : Observable<Blob> {
    return this.http.get(`${this.apiUrl}/active/flayer`, {
      responseType: 'blob',
    });
  }



  getExposures(id: number, page: number, size: number): Observable<ApiResponse<ExposureItem>> {
    const params = {pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse<ExposureItem>>(`${this.apiUrl}/${id}/exposures`, { params });

  }

}
