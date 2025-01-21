import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {AttendanceInsertItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  private apiUrl = 'http://localhost:5196/api/Attendances'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  getExposures(page: number, size: number, search: string): Observable<ApiResponse<AttendanceInsertItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<AttendanceInsertItem>>(this.apiUrl, { params });
  }

  createAttendance(attendance: AttendanceInsertItem): Observable<any>{
    return this.http.post(this.apiUrl, attendance);
  }
}
