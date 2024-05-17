import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketsPage } from '../model/tickets-page';
import { TicketModel } from '../model/ticket-model';

const ticketApiPrefix = '/api/ticket'

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private readonly http: HttpClient) { }

  getTickets(page: number, size:number = 10): Observable<TicketsPage>{
    return this.http.get<TicketsPage>(`${ticketApiPrefix}/owned?page=${page}&size=${size}`);
  }

  getTicketModels(): Observable<TicketModel[]>{
    return this.http.get<TicketModel[]>(ticketApiPrefix);
  }

  buyTicket(ticketId: number, duration?: number): Observable<any> {  
    return this.http.post(`${ticketApiPrefix}/buy?ticketId=${ticketId}`, duration ? duration : 0);
  }
}
