import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getApiUrl(): string {
    return environment.apiUrl;
  }

}