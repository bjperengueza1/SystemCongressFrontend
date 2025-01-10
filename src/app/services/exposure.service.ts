import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExposureInsertItem, ExposureItem} from '../interfaces/entities';
import {ApiResponse} from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ExposureService {
  private apiUrl = 'http://localhost:5196/api/Exposures'; // Endpoint de la API

  constructor(private http: HttpClient) { }


  getExposures(page: number, size: number, search: string): Observable<ApiResponse<ExposureItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<ExposureItem>>(this.apiUrl, { params });
  }

  //Crear una exposicion
  createExposure(exposureInsertItem: ExposureInsertItem): Observable<any> {
    exposureInsertItem.Authors = exposureInsertItem.Authors.map(author => {
      return {
        ...author, // Copia el resto de las propiedades
        AcademicDegree: parseInt(String(author.AcademicDegree), 10), // Convierte a entero
        IDNumber: String(author.IDNumber),
      };
    });

    const formDataToSend = new FormData();
    // Agregar los datos del formulario
    formDataToSend.append("Name", exposureInsertItem.Name);
    if(exposureInsertItem.ResearchLine)
      formDataToSend.append("ResearchLine", exposureInsertItem.ResearchLine.toString());
    formDataToSend.append("CongressGuid", exposureInsertItem.CongressGuid);
    formDataToSend.append("Authors", JSON.stringify(exposureInsertItem.Authors,null, 2));
    if(exposureInsertItem.pdfFile)
      formDataToSend.append('pdfFile', exposureInsertItem.pdfFile, exposureInsertItem.pdfFile.name)

    return this.http.post(this.apiUrl, formDataToSend);
  }


}
