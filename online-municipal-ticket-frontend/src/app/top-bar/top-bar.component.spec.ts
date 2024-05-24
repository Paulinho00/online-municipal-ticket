import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { UserService } from '../user/services/user.service';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { UserRole } from '../user/model/user-role';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let router: any;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser', 'logout']);

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TopBarComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out user', () => {
    userServiceMock.logout.and.returnValue(of({}));

    component.logOut();
    fixture.detectChanges();
    
    expect(userServiceMock.logout).toHaveBeenCalled();
  });

  it('should display "Kup bilet" link for passenger user', () => {
    userServiceMock.getUser.and.returnValue({ name: 'Michal', lastName: 'Sikacki', email: 'user11@email.com',
    token: '123456789', role: UserRole.Passenger });

    fixture.detectChanges();

    const anchorElement = fixture.nativeElement.querySelector('a.nav-link');
    expect(anchorElement.textContent).toContain('Kup bilet');
  });

  it('should display "Sprawdź bilet" link for ticket inspector user', () => {
    userServiceMock.getUser.and.returnValue({ name: 'Michal', lastName: 'Sikacki', email: 'user11@email.com',
    token: '123456789', role: UserRole.TicketInspector });

    fixture.detectChanges();

    const anchorElement = fixture.nativeElement.querySelector('a.nav-link');
    expect(anchorElement.textContent).toContain('Sprawdź bilet');
  });

  it('should display user name in welcome message', () => {
    userServiceMock.getUser.and.returnValue({ name: 'Michal', lastName: 'Sikacki', email: 'user11@email.com',
    token: '123456789', role: UserRole.Passenger });

    fixture.detectChanges();

    const navlinkItems = Array.from(fixture.nativeElement.querySelectorAll('a.nav-link')) as HTMLElement[];
    const welcomUserLink = navlinkItems.find(item => item.textContent?.includes('Witaj Michal'));

    expect(welcomUserLink).toBeTruthy();
  });

  it('should display "Moje bilety" link for passenger user', () => {
    userServiceMock.getUser.and.returnValue({ name: 'Michal', lastName: 'Sikacki', email: 'user11@email.com',
    token: '123456789', role: UserRole.Passenger });

    fixture.detectChanges();

    const dropdownItems = Array.from(fixture.nativeElement.querySelectorAll('a.dropdown-item')) as HTMLElement[];
    const myTicketsLink = dropdownItems.find(item => item.textContent?.includes('Moje bilety'));

    expect(myTicketsLink).toBeTruthy();
  });

  it('should not display "Moje bilety" link for non-passenger user', () => {
    userServiceMock.getUser.and.returnValue({ name: 'Michal', lastName: 'Sikacki', email: 'user11@email.com',
    token: '123456789', role: UserRole.TicketInspector });

    fixture.detectChanges();

    const dropdownItems = Array.from(fixture.nativeElement.querySelectorAll('a.dropdown-item')) as HTMLElement[];
    const myTicketsLink = dropdownItems.find(item => item.textContent?.includes('Moje bilety'));

    expect(myTicketsLink).toBeFalsy();
  });

});