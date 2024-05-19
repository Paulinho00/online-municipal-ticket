import { TicketType } from "./ticket-type";

export interface TicketModel {
    id: number,
    type: TicketType,
    durationSeconds?: number,
    price: number,
    isReduced: boolean
}