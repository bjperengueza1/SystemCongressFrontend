import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExposureService {
  private apiUrl = 'http://localhost:5196/api/Exposures'; // Endpoint de la API

  constructor(private http: HttpClient) { }

  //Crear una exposicion
  createExposure(formData: any, file: File | null): Observable<any> {
    const formDataToSend = new FormData();
    // Agregar los datos del formulario
    formDataToSend.append('name', formData.name);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('researchLine', formData.researchLine);
    formDataToSend.append('congressGuid', formData.congressGuid);
    formDataToSend.append('authors', "[]");

    if (file) {
      formDataToSend.append('pdfFile', file, file.name);  // 'pdfFile' es el nombre del campo para el archivo
    }



    return this.http.post(this.apiUrl, formDataToSend);
  }
}
