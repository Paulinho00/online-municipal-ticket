import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from '../../model/ticket';
import { NgIf } from '@angular/common';
import { TicketType } from '../../model/ticket-type';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss'
})
export class TicketDetailsComponent implements OnInit{
  @Input() ticket!: Ticket;
  ticketTypeName: string = "";
  isPeriodic: boolean = false;
  isTimed: boolean = false;
  isDisposable: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    switch(this.ticket.type){
      case TicketType.Timed:{
        this.ticketTypeName = "Czasowy";
        this.isTimed = true;
        break;
      }
      case TicketType.Disposable:{
        this.ticketTypeName = "Jednorazowy";
        this.isDisposable = true;
        break;
      }
      case TicketType.Periodic:{
        this.ticketTypeName = "Okresowy";
        this.isPeriodic = true;
        break;
      }
    }
  }
}
