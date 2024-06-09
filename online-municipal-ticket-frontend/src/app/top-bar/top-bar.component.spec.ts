import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { UserService } from '../user/services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { UserRole } from '../user/model/user-role';
import { LoginReply } from '../api/models';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let router: any;

  const mockLoginReply1: LoginReply = {
    email: 'user@email.com',
    lastName: 'Sikacki',
    name: 'Michal',
    role: UserRole.Passenger,
    token: '1111111111',
    userId: 1
  };

  const mockLoginReply2: LoginReply = {
    email: 'user@email.com',
    lastName: 'Sikacki',
    name: 'Michal',
    role: UserRole.TicketInspector,
    token: '1111111111',
    userId: 1
  };

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser', 'logout']);

    userServiceMock.currentUser = new BehaviorSubject<LoginReply | undefined>(mockLoginReply1);

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
    userServiceMock.currentUser.next(mockLoginReply1);
    userServiceMock.getUser.and.returnValue(of({}) as LoginReply);

    fixture.detectChanges();

    const anchorElement = fixture.nativeElement.querySelector('a.nav-link');
    expect(anchorElement.textContent).toContain('Kup bilet');
  });

  it('should display "Sprawdź bilet" link for ticket inspector user', () => {
    userServiceMock.currentUser.next(mockLoginReply2);
    userServiceMock.getUser.and.returnValue(of({}) as LoginReply);

    fixture.detectChanges();

    const anchorElement = fixture.nativeElement.querySelector('a.nav-link');
    expect(anchorElement.textContent).toContain('Sprawdź bilet');
  });

  it('should display user name in welcome message', () => {
    userServiceMock.currentUser.next(mockLoginReply1);
    userServiceMock.getUser.and.returnValue(of({}) as LoginReply);

    fixture.detectChanges();

    const navlinkItems = Array.from(fixture.nativeElement.querySelectorAll('a.nav-link')) as HTMLElement[];
    const welcomUserLink = navlinkItems.find(item => item.textContent?.includes('Witaj Michal'));

    expect(welcomUserLink).toBeTruthy();
  });

  it('should display "Moje bilety" link for passenger user', () => {
    userServiceMock.currentUser.next(mockLoginReply1);
    userServiceMock.getUser.and.returnValue(of({}) as LoginReply);

    fixture.detectChanges();

    const dropdownItems = Array.from(fixture.nativeElement.querySelectorAll('a.dropdown-item')) as HTMLElement[];
    const myTicketsLink = dropdownItems.find(item => item.textContent?.includes('Moje bilety'));

    expect(myTicketsLink).toBeTruthy();
  });

  it('should not display "Moje bilety" link for non-passenger user', () => {
    userServiceMock.currentUser.next(mockLoginReply2);
    userServiceMock.getUser.and.returnValue(of({}) as LoginReply);

    fixture.detectChanges();

    const dropdownItems = Array.from(fixture.nativeElement.querySelectorAll('a.dropdown-item')) as HTMLElement[];
    const myTicketsLink = dropdownItems.find(item => item.textContent?.includes('Moje bilety'));

    expect(myTicketsLink).toBeFalsy();
  });

});