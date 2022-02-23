import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CodeUploadPayload, RegistrationPayload, Response } from './interfaces';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  constructor(private httpClient: HttpClient) { }
  
  async codeUpload(payload: CodeUploadPayload, options?: Object): Promise<Response> {
    let response = await firstValueFrom(this.httpClient.post<Response>("https://ncp.staging.moonproject.io/api/nyiro-marcell/code/upload", JSON.stringify(payload), options)).catch((err: HttpErrorResponse) => {
      let response: Response = {errors: []};
      err.error.errors.forEach(function(error: any) {
        response.errors.push({code: error.code, source: error.source.parameters[0]})
      })
      return response;
    });

    return response;
  }

  async registration(payload: RegistrationPayload, options?: Object): Promise<Response> {
    let response = await firstValueFrom(this.httpClient.post<Response>("https://ncp.staging.moonproject.io/api/nyiro-marcell/user/register", JSON.stringify(payload), options)).catch((err: HttpErrorResponse) => {
      let response: Response = {errors: []};
      err.error.errors.forEach(function(error: any) {
        response.errors.push({code: error.code, source: error.source.parameters[0]})
      })
      return response;
    });

    return response;
  }
}
