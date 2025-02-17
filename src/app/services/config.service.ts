import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getApiUrl(): string {
    console.log(environment.production);
    return environment.apiUrl;
  }

}