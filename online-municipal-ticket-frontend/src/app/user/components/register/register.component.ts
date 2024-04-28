import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  readonly registerForm: FormGroup
  private strongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(){
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.strongPasswordRegx)]),
      confirmPassword: new FormControl ('', [Validators.required])
    },{
      validators: [ this.equivalentValidator('password', 'confirmPassword') ]
    })
  }

  get passwordFormField() {
    return this.registerForm.get('password');
  }

  onSubmit(){

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
