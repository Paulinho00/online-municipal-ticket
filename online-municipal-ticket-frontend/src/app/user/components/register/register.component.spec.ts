import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form with correct initial values', () => {
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should mark isEmailTaken as true if registration fails with 409 status', () => {
    const errorResponse = { status: 409 };
    userServiceMock.register.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalled();
    expect(component.isEmailTaken).toBeTrue();
  });

  it('should navigate to login page on successful registration', () => {
    userServiceMock.register.and.returnValue(of({}));

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should invalidate form if passwords do not match', () => {
    component.registerForm.controls['password'].setValue('Password11');
    component.registerForm.controls['confirmPassword'].setValue('DifferentPassword11');

    component.registerForm.updateValueAndValidity();

    const confirmPasswordErrors = component.registerForm.controls['confirmPassword'].errors;
    expect(confirmPasswordErrors).toBeTruthy();
    expect(confirmPasswordErrors?.['notEqual']).toBeTrue();
  });

  it('should invalidate form if email is empty', () => {
    component.registerForm.controls['email'].setValue('');
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.controls['email'].errors?.['required']).toBeTrue();
  });

  it('should invalidate form if name is empty', () => {
    component.registerForm.controls['name'].setValue('');
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.controls['name'].errors?.['required']).toBeTrue();
  });

  it('should invalidate form if lastName is empty', () => {
    component.registerForm.controls['lastName'].setValue('');
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.controls['lastName'].errors?.['required']).toBeTrue();
  });

  it('should not submit the form if it is invalid', () => {
    component.registerForm.controls['email'].setValue('');
    component.onSubmit();

    expect(userServiceMock.register).not.toHaveBeenCalled();
  });
});
