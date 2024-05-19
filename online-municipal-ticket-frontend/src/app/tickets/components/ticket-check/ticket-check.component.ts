import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ticket-check',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './ticket-check.component.html',
  styleUrl: './ticket-check.component.scss'
})
export class TicketCheckComponent {
  readonly ticketForm: FormGroup;
  public isTicketValid: boolean = false;
  public isTicketInvalid: boolean = false;


  constructor(private readonly ticketService: TicketService){
    this.ticketForm = new FormGroup({
      ticketId: new FormControl('', [Validators.required]),
      vehicleNumber: new FormControl('', [Validators.required])
    })
  }


  onSubmit(){
    if(this.ticketForm.valid){
      this.ticketService.checkTicket(+this.ticketForm.value.ticketId, +this.ticketForm.value.vehicleNumber).subscribe((response) => {
        if(response){
          this.isTicketValid = true;
          this.isTicketInvalid = false;
        }
        else{
          this.isTicketValid = false;
          this.isTicketInvalid = true;
        }
      })
    }
  }
}
