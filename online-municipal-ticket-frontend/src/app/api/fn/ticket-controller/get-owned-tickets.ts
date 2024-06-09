/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TicketPageReply } from '../../models/ticket-page-reply';

export interface GetOwnedTickets$Params {
  token: string;
  page?: number;
  size?: number;
}

export function getOwnedTickets(http: HttpClient, rootUrl: string, params: GetOwnedTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketPageReply>> {
  const rb = new RequestBuilder(rootUrl, getOwnedTickets.PATH, 'get');
  if (params) {
    rb.header('token', params.token, {});
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TicketPageReply>;
    })
  );
}

getOwnedTickets.PATH = '/ticket/owned';
