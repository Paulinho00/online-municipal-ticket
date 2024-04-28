import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-check',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-check.component.html',
  styleUrl: './ticket-check.component.scss'
})
export class TicketCheckComponent {
  readonly ticketForm: FormGroup

  constructor(){
    this.ticketForm = new FormGroup({
      ticketId: new FormControl('', [Validators.required]),
      vehicleNumber: new FormControl('', [Validators.required])
    })
  }


  onSubmit(){

  }
}
