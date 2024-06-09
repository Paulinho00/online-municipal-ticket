/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface Check$Params {
  token: string;
  ticketInstanceId: number;
  vehicleId?: string;
}

export function check(http: HttpClient, rootUrl: string, params: Check$Params, context?: HttpContext): Observable<StrictHttpResponse<boolean>> {
  const rb = new RequestBuilder(rootUrl, check.PATH, 'get');
  if (params) {
    rb.header('token', params.token, {});
    rb.query('ticketInstanceId', params.ticketInstanceId, {});
    rb.query('vehicleId', params.vehicleId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
    })
  );
}

check.PATH = '/ticket/check';
