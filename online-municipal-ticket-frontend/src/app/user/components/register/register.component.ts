import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  readonly registerForm!: FormGroup
  private strongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  public isEmailTaken: boolean = false;

  constructor(private readonly userService: UserService, private readonly router: Router){
    this.registerForm = new FormGroup({
      email: new FormControl('email@email.pl', [Validators.required, Validators.maxLength(60)]),
      name: new FormControl('Imię', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
      lastName: new FormControl('Nazwisko', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
      password: new FormControl('Password1!', [Validators.required, Validators.pattern(this.strongPasswordRegx)]),
      confirmPassword: new FormControl ('Password1!', [Validators.required])
    },{
      validators: [ this.equivalentValidator('password', 'confirmPassword') ]
    })
  }

  get passwordFormField() {
    return this.registerForm.get('password');
  }

  onSubmit(){
      if(this.registerForm.valid){
        this.userService.register(this.registerForm.value)
          .subscribe({            
            next: (response) => {
              this.router.navigateByUrl('/login');
            },
            error: (e) => {
              if(e.status == 409){
                this.isEmailTaken = true;
              }
            }
          });
      }
  }

  private equivalentValidator = (firstControlName: string, secondControlName: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const firstControl = control.get(firstControlName);
      const secondControl = control.get(secondControlName);
    
      if (secondControl?.value && secondControl.value !== firstControl?.value) {
        secondControl.setErrors({ notEqual: true });
      }
    
      return null;
    };
  };
}
