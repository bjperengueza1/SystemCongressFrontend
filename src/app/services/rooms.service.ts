import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {RoomWitchCongressItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = 'http://localhost:5196/api/Rooms'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  //Obtener la lista de Rooms
  getRooms(page:number, size:number): Observable<ApiResponse<RoomWitchCongressItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse<RoomWitchCongressItem>>(`${this.apiUrl}/WithCongress`, { params });
  }
}
