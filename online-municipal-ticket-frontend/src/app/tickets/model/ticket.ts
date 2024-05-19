import { TicketType } from "./ticket-type";

export interface Ticket {
    id: string,
    type: TicketType,
    purchaseDate: string,
    activationDate?: string,
    validUntil: string,
    isDiscounted: boolean
    vehicleId?: string
}