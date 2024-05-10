import { Component, OnInit } from '@angular/core';
import { TicketDetailsComponent } from '../ticket-details/ticket-details.component';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../model/ticket';
import { NgFor, NgIf } from '@angular/common';

const pageSize: number = 1

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [TicketDetailsComponent, NgIf, NgFor],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit{
    public currentPage: number = 0
    public hasNextPage: boolean = false
    public hasPreviousPage: boolean = false
    public tickets: Ticket[] = []

    constructor(private readonly ticketService: TicketService) {}

    ngOnInit(): void {
      this.getTicketsForCurrentPage();
    }

    changePage(page: number): void {
      this.currentPage = page;
      this.getTicketsForCurrentPage();
    }

    private getTicketsForCurrentPage(): void{
      this.ticketService.getTickets(this.currentPage, pageSize).subscribe((response) => {
        this.hasNextPage = response.totalPages > 0 && this.currentPage < response.totalPages-1;
        this.hasPreviousPage = this.currentPage > 0;
        this.tickets = response.tickets;
      })
    }
}
