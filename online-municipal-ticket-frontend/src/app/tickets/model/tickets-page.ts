import { Ticket } from "./ticket"

export interface TicketsPage {
    tickets: Ticket[]
    totalPages: number
}