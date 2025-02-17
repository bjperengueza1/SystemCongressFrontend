import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {AttendanceInsertItem, AttendanceItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  private apiUrl = 'http://34.173.148.212:8080/api/Attendances'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  getAttendances(page: number, size: number, search: string): Observable<ApiResponse<AttendanceItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<AttendanceItem>>(this.apiUrl, { params });
  }

  createAttendance(attendance: AttendanceInsertItem): Observable<any>{
    return this.http.post(this.apiUrl, attendance);
  }
}
