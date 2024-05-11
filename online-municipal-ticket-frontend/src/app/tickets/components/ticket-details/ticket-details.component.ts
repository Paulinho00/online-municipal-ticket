import { Component, Input} from '@angular/core';
import { Ticket } from '../../model/ticket';
import { DatePipe, NgIf } from '@angular/common';
import { TicketTypePipe } from '../../services/ticket-type-pipe';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss',
})
export class TicketDetailsComponent{
  @Input() ticket!: Ticket;
  ticketTypeName: string = "";
  isPeriodic: boolean = false;
  isTimed: boolean = false;
  isDisposable: boolean = false;

  constructor(private datePipe: DatePipe, public ticketTypePipe: TicketTypePipe) {

  }

  formatDateString(dateTimeString: string): string | null {
    return this.datePipe.transform(dateTimeString, "dd.MM.yyyy HH:mm");
  }
}
