import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketsPage } from '../model/tickets-page';

const ticketApiPrefix = '/api/ticket'

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private readonly http: HttpClient) { }

  getTickets(page: number, size:number = 10): Observable<TicketsPage>{
    return this.http.get<TicketsPage>(`${ticketApiPrefix}/owned?page=${page}&size=${size}`)
  }
}
