import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { UserRole } from '../../model/user-role';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    userServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue({
        name: 'Michal',
        lastName: 'Sikacki',
        email: 'user11@email.com',
        token: '123456789',
        role: UserRole.Passenger
      } as User)
    };

    await TestBed.configureTestingModule({
      imports: [ UserDetailsComponent ],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user and userRole correctly', () => {
    expect(component.user).toEqual({
      name: 'Michal',
      lastName: 'Sikacki',
      email: 'user11@email.com',
      token: '123456789',
      role: UserRole.Passenger
    });
    expect(component.userRole).toBe('Pasażer');
  });
});