import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketControllerService } from '../../api/services';
import { UserService } from '../../user/services/user.service';
import { TicketModel, TicketPageReply } from '../../api/models';

const ticketApiPrefix = '/api/ticket'

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private readonly ticketControllerService: TicketControllerService,
    private readonly userService: UserService
   ) { }

  getTickets(page: number, size:number = 10): Observable<TicketPageReply>{
    return this.ticketControllerService.getOwnedTickets({token: this.userService.getToken(), page: page, size: size})
  }

  getTicketModels(): Observable<TicketModel[]>{
    return this.ticketControllerService.getTickets({token: this.userService.getToken()})
  }

  buyTicket(ticketId: number, duration?: number): Observable<any> {  
    return this.ticketControllerService.buy({token: this.userService.getToken(), ticketId: ticketId, body: duration ? duration : undefined})
  }

  checkTicket(ticketId: number, vehicleId: number): Observable<boolean>{
    return this.ticketControllerService.check({token: this.userService.getToken(), ticketInstanceId: ticketId, vehicleId: vehicleId.toString()})
  }
}
