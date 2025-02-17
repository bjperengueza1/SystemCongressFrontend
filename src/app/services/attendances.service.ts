import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {AttendanceInsertItem, AttendanceItem} from '../interfaces/entities';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  private apiUrl: string = "";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.getApiUrl()+"api/Attendances"; 
  }

  getAttendances(page: number, size: number, search: string): Observable<ApiResponse<AttendanceItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<AttendanceItem>>(this.apiUrl, { params });
  }

  createAttendance(attendance: AttendanceInsertItem): Observable<any>{
    return this.http.post(this.apiUrl, attendance);
  }
}
