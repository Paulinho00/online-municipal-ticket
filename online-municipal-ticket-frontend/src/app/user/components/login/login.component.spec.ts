import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let router: Router;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['login']);
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, LoginComponent ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useClass: class { navigateByUrl = jasmine.createSpy('navigateByUrl'); } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userServiceMock = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set wrongCredentials to true if login fails with 401 status', () => {
    const errorResponse = { status: 401 };
    userServiceMock.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('user11@email.com');
    component.loginForm.controls['password'].setValue('password11');

    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalled();
    expect(component.wrongCredentials).toBeTrue();
  });

  it('should navigate to ticket-list if login is successful', () => {
    userServiceMock.login.and.returnValue(of({}));

    component.loginForm.controls['email'].setValue('user11@email.com');
    component.loginForm.controls['password'].setValue('password11');

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('ticket-list');
  });

  it('should not set wrongCredentials if login is successful', () => {
    userServiceMock.login.and.returnValue(of({}));

    component.loginForm.controls['email'].setValue('user11@email.com');
    component.loginForm.controls['password'].setValue('password11');

    component.onSubmit();

    expect(component.wrongCredentials).toBeFalse();
  });

  it('should not set wrongCredentials if login fails with status other than 401', () => {
    const errorResponse = { status: 500 };
    userServiceMock.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('user11@email.com');
    component.loginForm.controls['password'].setValue('password11');

    component.onSubmit();

    expect(component.wrongCredentials).toBeFalse();
  });
});
