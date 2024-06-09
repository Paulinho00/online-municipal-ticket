import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../model/user-role';
import { LoginReply } from '../../../api/models';
import { BehaviorSubject} from 'rxjs';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  const mockLoginReply: LoginReply = {
    email: 'user@email.com',
    lastName: 'Sikacki',
    name: 'Michal',
    role: UserRole.Passenger,
    token: '1111111111'
  };

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser', 'logout']);

    userServiceMock.currentUser = new BehaviorSubject<LoginReply | undefined>(mockLoginReply);

    userServiceMock.currentUser.next(mockLoginReply);

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
      email: 'user@email.com',
      token: '1111111111',
      role: UserRole.Passenger
    });
    expect(component.userRole).toBe('Pasażer');
  });
});