import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly loginForm: FormGroup
  public wrongCredentials: boolean = false;
  
  constructor(private readonly userService: UserService, 
    private readonly router: Router){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.userService.login(this.loginForm.value)
        .subscribe({
          next: (response) => this.router.navigateByUrl('ticket-list'),
          error: (e) => {
            if(e.status == 401){
              this.wrongCredentials = true;
            }
          }
        })
    }
  }
}
