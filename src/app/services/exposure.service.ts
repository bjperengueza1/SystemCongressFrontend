import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApproveExposureModel, ExposureInsertItem, ExposureItem, RejectExposureModel} from '../interfaces/entities';
import {ApiResponse} from '../interfaces/api-response';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ExposureService {

  private apiUrl: string = "";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.getApiUrl()+"api/Exposures";
  }


  getExposures(page: number, size: number, search: string): Observable<ApiResponse<ExposureItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search };
    return this.http.get<ApiResponse<ExposureItem>>(this.apiUrl, { params });
  }
  getExposures2(page: number, size: number, search: string, congressId: number,researchLine: number): Observable<ApiResponse<ExposureItem>> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search, congressId: congressId, ResearchLine: researchLine };
    return this.http.get<ApiResponse<ExposureItem>>(this.apiUrl, { params });
  }
  downloadReport(page: number, size: number, search: string, congressId: number, researchLine: number): Observable<any> {
    const params = { pageNumber: page.toString(), pageSize: size.toString(), search, congressId: congressId, ResearchLine: researchLine };
    return this.http.get(`${this.apiUrl}/reportsxls`, {
      params,
      responseType: 'blob',
      observe: 'response' // Para acceder a headers y body
    });
  }

  getExposure(id: string): Observable<ExposureItem> {
    return this.http.get<ExposureItem>(`${this.apiUrl}/guid/${id}`);
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
    formDataToSend.append("Type", exposureInsertItem.Type.toString());
    formDataToSend.append("CongressGuid", exposureInsertItem.CongressGuid);
    formDataToSend.append("Authors", JSON.stringify(exposureInsertItem.Authors,null, 2));
    if(exposureInsertItem.pdfFile)
      formDataToSend.append('pdfFile', exposureInsertItem.pdfFile, exposureInsertItem.pdfFile.name)

    return this.http.post(this.apiUrl, formDataToSend);
  }

  //actualizar estado
  changeStatus(id: number, status: number): Observable<any> {
    const body = {statusExposure: status};
    return this.http.put(`${this.apiUrl}/${id}/status`, body);
  }

  //aprobar exposicion
  approveExposure(id: number, body:ApproveExposureModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, body);
  }

  //rechazar exposicion
  rejectExposure(id: number, body:RejectExposureModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, body);
  }

  //download pdf file
  downloadExposure(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/summary`, {
      responseType: 'blob',
      observe: 'response' // Para acceder a headers y body
    });
  }

  //register email in exposure
  registerPrevious(id: number, email: string): Observable<any> {
    const body = {email: email};
    return this.http.post(`${this.apiUrl}/${id}/register-previous`, body);
  }
}
