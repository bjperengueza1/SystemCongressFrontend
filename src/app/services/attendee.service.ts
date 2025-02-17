import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AttendeeItem} from '../interfaces/entities';
import {ApiResponse} from '../interfaces/api-response';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendeeService {

  private apiUrl = 'http://34.173.148.212:8080/api/Attendees'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  getAttendees(page: number, size: number, search: string): Observable<ApiResponse<AttendeeItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<AttendeeItem>>(this.apiUrl, { params });
  }
}
