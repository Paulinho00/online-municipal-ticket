import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly loginForm: FormGroup
  
  constructor(private readonly authService: AuthService, 
    private readonly userService: UserService, 
    private readonly router: Router){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.userService.login(this.loginForm.value)
        .subscribe((response) => {
          console.log('response', response);
          this.authService.loginUser(response);
          this.router.navigateByUrl('ticket-list');
        });
    }
  }
}
