import { TicketType } from "./ticket-type";

export interface Ticket {
    id: string,
    type: TicketType,
    purchaseDate: Date,
    activationDate?: Date,
    validUntil: Date,
    isDiscounted: boolean
}