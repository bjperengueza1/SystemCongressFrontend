import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AttendeeItem} from '../interfaces/entities';
import {ApiResponse} from '../interfaces/api-response';
import {Observable} from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AttendeeService {

  private apiUrl: string = "";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.getApiUrl()+"api/Attendees"; 
  }

  getAttendees(page: number, size: number, search: string): Observable<ApiResponse<AttendeeItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<AttendeeItem>>(this.apiUrl, { params });
  }
}
