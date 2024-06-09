import { Component, OnInit } from '@angular/core';
import { TicketDetailsComponent } from '../ticket-details/ticket-details.component';
import { TicketService } from '../../services/ticket.service';
import { NgFor, NgIf } from '@angular/common';
import { Ticket } from '../../../api/models';

const pageSize: number = 2

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
    public isListEmpty: boolean = true;
    public tickets: Ticket[] | undefined

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
        this.hasNextPage = response.tickets!.length > 0 && this.currentPage < response.totalPages!-1;
        this.isListEmpty = response.totalPages == 0;
        this.hasPreviousPage = this.currentPage > 0;
        this.tickets = response.tickets;
      })
    }
}
