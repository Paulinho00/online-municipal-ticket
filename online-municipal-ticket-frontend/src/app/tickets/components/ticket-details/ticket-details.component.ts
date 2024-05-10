import { Component, Input } from '@angular/core';
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
export class TicketDetailsComponent {
  @Input() ticket!: Ticket
  TicketType = TicketType
  constructor() {}
}
