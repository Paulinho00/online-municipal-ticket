import { Pipe, PipeTransform } from "@angular/core";
import { TicketType } from "../model/ticket-type";

@Pipe({ name: 'ticketTypeLabel' })
export class TicketTypePipe implements PipeTransform {
  transform(value: TicketType): string {
    switch (value) {
      case TicketType.Timed:
        return 'Czasowy';
      case TicketType.Periodic:
        return 'Okresowy';
      case TicketType.Disposable:
        return 'Jednorazowy';
      default:
        return '';
    }
  }
}
