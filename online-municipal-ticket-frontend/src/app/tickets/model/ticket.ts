import { TicketType } from "./ticket-type";

export interface Ticket {
    code: string,
    type: TicketType,
    purchaseDate: Date,
    validFrom: Date,
    validUntil: Date,
    isDiscounted: boolean
}