import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { TicketModel } from '../../model/ticket-model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TicketType } from '../../model/ticket-type';
import { TicketTypePipe } from '../../services/ticket-type-pipe';

@Component({
  selector: 'app-ticket-purchase',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './ticket-purchase.component.html',
  styleUrl: './ticket-purchase.component.scss'
})
export class TicketPurchaseComponent implements OnInit{
  public availableTicketModels: TicketModel[] = [];
  public selectedTicketModel!: TicketModel;
  public startDate!: string;
  public isTransactionSuccesful: boolean = false;
  public wrongDates: boolean = false;
  constructor (private readonly ticketService: TicketService, public ticketTypePipe: TicketTypePipe) {
  }

  ngOnInit(): void {
    this.ticketService.getTicketModels()
      .subscribe((response) => {
        this.availableTicketModels = response;
      })

    this.selectedTicketModel = this.availableTicketModels[0]
  }

  onSubmit(): void {
    let selectedId = this.selectedTicketModel.id;
    let date = new Date(this.startDate)
    if(this.selectedTicketModel.type == TicketType.Timed && date.getTime() < Date.now())
    {
      this.wrongDates = true;
      return;
    }

    this.ticketService.buyTicket(selectedId, date.getTime())
      .subscribe((response) => {
        if(response.status == 200){
          this.isTransactionSuccesful = true;
        }
      })
  }
}
