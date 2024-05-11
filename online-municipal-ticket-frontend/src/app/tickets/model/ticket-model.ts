import { TicketType } from "./ticket-type";

export interface TicketModel {
    id: number,
    type: TicketType,
    durationInSeconds?: number,
    price: number,
    isReduced: boolean
}