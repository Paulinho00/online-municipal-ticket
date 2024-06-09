/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TicketModel } from '../../models/ticket-model';

export interface GetTickets$Params {
  token: string;
}

export function getTickets(http: HttpClient, rootUrl: string, params: GetTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TicketModel>>> {
  const rb = new RequestBuilder(rootUrl, getTickets.PATH, 'get');
  if (params) {
    rb.header('token', params.token, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<TicketModel>>;
    })
  );
}

getTickets.PATH = '/ticket';
