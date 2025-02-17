import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {ApiResponse} from '../interfaces/api-response';
import {CongressItem, RoomsItem, RoomWitchCongressItem} from '../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = 'http://34.173.148.212:5196/api/Rooms'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  //Obtener la lista de Rooms
  getRooms(page:number, size:number, search: string): Observable<ApiResponse<RoomWitchCongressItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<RoomWitchCongressItem>>(`${this.apiUrl}/WithCongress`, { params });
  }

  //Crear una sala
  createRoom(room: RoomsItem): Observable<any> {
    return this.http.post<any>(this.apiUrl, room);
  }

  //Actualizar la sala
  updateRoom(room: RoomsItem): Observable<any> {
    const url = `${this.apiUrl}/${room.roomId}`;
    return this.http.put<any>(url, room);
  }

  searchRoomsByCongress(id: number): Observable<RoomsItem[]> {
    return this.http
      .get<ApiResponse<RoomsItem>>(`${this.apiUrl}/${id}/Rooms`)
      .pipe(
        map((response) => response.items || []),
        catchError(() => of([]))
      );
  }

  getRoomsByCongress(id: number,page: number, size: number): Observable<ApiResponse<RoomsItem>> {
    const params = {pageNumber: page.toString(), pageSize: size.toString() };
    return this.http.get<ApiResponse<RoomsItem>>(`${this.apiUrl}/${id}/Rooms`, { params });
  }




}
