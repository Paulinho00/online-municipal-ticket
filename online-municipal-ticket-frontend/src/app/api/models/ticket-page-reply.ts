/* tslint:disable */
/* eslint-disable */
import { Ticket } from '../models/ticket';
export interface TicketPageReply {
  tickets?: Array<Ticket>;
  totalElements?: number;
  totalPages?: number;
}
