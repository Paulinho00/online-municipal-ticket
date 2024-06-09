/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { buy } from '../fn/ticket-controller/buy';
import { Buy$Params } from '../fn/ticket-controller/buy';
import { check } from '../fn/ticket-controller/check';
import { Check$Params } from '../fn/ticket-controller/check';
import { getOwnedTickets } from '../fn/ticket-controller/get-owned-tickets';
import { GetOwnedTickets$Params } from '../fn/ticket-controller/get-owned-tickets';
import { getTickets } from '../fn/ticket-controller/get-tickets';
import { GetTickets$Params } from '../fn/ticket-controller/get-tickets';
import { TicketModel } from '../models/ticket-model';
import { TicketPageReply } from '../models/ticket-page-reply';
import { use } from '../fn/ticket-controller/use';
import { Use$Params } from '../fn/ticket-controller/use';

@Injectable({ providedIn: 'root' })
export class TicketControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `use()` */
  static readonly UsePath = '/ticket/use';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `use()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  use$Response(params: Use$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return use(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `use$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  use(params: Use$Params, context?: HttpContext): Observable<string> {
    return this.use$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `buy()` */
  static readonly BuyPath = '/ticket/buy';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `buy()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  buy$Response(params: Buy$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return buy(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `buy$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  buy(params: Buy$Params, context?: HttpContext): Observable<number> {
    return this.buy$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getTickets()` */
  static readonly GetTicketsPath = '/ticket';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTickets()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTickets$Response(params: GetTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TicketModel>>> {
    return getTickets(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTickets$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTickets(params: GetTickets$Params, context?: HttpContext): Observable<Array<TicketModel>> {
    return this.getTickets$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TicketModel>>): Array<TicketModel> => r.body)
    );
  }

  /** Path part for operation `getOwnedTickets()` */
  static readonly GetOwnedTicketsPath = '/ticket/owned';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOwnedTickets()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOwnedTickets$Response(params: GetOwnedTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketPageReply>> {
    return getOwnedTickets(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOwnedTickets$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOwnedTickets(params: GetOwnedTickets$Params, context?: HttpContext): Observable<TicketPageReply> {
    return this.getOwnedTickets$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketPageReply>): TicketPageReply => r.body)
    );
  }

  /** Path part for operation `check()` */
  static readonly CheckPath = '/ticket/check';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `check()` instead.
   *
   * This method doesn't expect any request body.
   */
  check$Response(params: Check$Params, context?: HttpContext): Observable<StrictHttpResponse<boolean>> {
    return check(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `check$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  check(params: Check$Params, context?: HttpContext): Observable<boolean> {
    return this.check$Response(params, context).pipe(
      map((r: StrictHttpResponse<boolean>): boolean => r.body)
    );
  }

}
