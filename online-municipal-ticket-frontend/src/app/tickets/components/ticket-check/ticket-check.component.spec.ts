import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TicketCheckComponent } from './ticket-check.component';
import { TicketService } from '../../services/ticket.service';

describe('TicketCheckComponent', () => {
  let component: TicketCheckComponent;
  let fixture: ComponentFixture<TicketCheckComponent>;
  let ticketServiceMock: jasmine.SpyObj<TicketService>;

  beforeEach(async () => {
    ticketServiceMock = jasmine.createSpyObj('TicketService', ['checkTicket']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TicketCheckComponent],
      providers: [
        { provide: TicketService, useValue: ticketServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    // given
    const ticketForm = component.ticketForm;

    // then
    expect(ticketForm).toBeTruthy();
    expect(ticketForm.controls['ticketId'].value).toBe('');
    expect(ticketForm.controls['vehicleNumber'].value).toBe('');
  });

  it('should have required validators on form controls', () => {
    // given
    const ticketForm = component.ticketForm;

    // then
    expect(ticketForm.controls['ticketId'].hasError('required')).toBeTruthy();
    expect(ticketForm.controls['vehicleNumber'].hasError('required')).toBeTruthy();
  });

  it('should call checkTicket on TicketService when form is valid', () => {
    // given
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(true));

    // when
    component.onSubmit();

    // then
    expect(ticketServiceMock.checkTicket).toHaveBeenCalledWith(123, 456);
  });

  it('should set isTicketValid to true and isTicketInvalid to false on valid ticket', () => {
    // given
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(true));

    // when
    component.onSubmit();
    fixture.detectChanges();

    // then
    expect(component.isTicketValid).toBeTrue();
    expect(component.isTicketInvalid).toBeFalse();
  });

  it('should set isTicketValid to false and isTicketInvalid to true on invalid ticket', () => {
    // given
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(false));

    // when
    component.onSubmit();
    fixture.detectChanges();

    // then
    expect(component.isTicketValid).toBeFalse();
    expect(component.isTicketInvalid).toBeTrue();
  });

  it('should not call checkTicket on TicketService when form is invalid', () => {
    // given
    component.ticketForm.controls['ticketId'].setValue('');
    component.ticketForm.controls['vehicleNumber'].setValue('');

    // when
    component.onSubmit();

    // then
    expect(ticketServiceMock.checkTicket).not.toHaveBeenCalled();
  });
});
