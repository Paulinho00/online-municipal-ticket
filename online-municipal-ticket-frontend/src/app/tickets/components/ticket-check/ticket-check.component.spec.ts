import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TicketCheckComponent } from './ticket-check.component';
import { TicketService } from '../../services/ticket.service';

describe('TicketCheckComponent', () => {
  let component: TicketCheckComponent;
  let fixture: ComponentFixture<TicketCheckComponent>;
  let ticketServiceMock: any;

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
    const ticketForm = component.ticketForm;
    expect(ticketForm).toBeTruthy();
    expect(ticketForm.controls['ticketId'].value).toBe('');
    expect(ticketForm.controls['vehicleNumber'].value).toBe('');
  });

  it('should have required validators on form controls', () => {
    const ticketForm = component.ticketForm;
    expect(ticketForm.controls['ticketId'].hasError('required')).toBeTruthy();
    expect(ticketForm.controls['vehicleNumber'].hasError('required')).toBeTruthy();
  });

  it('should call checkTicket on TicketService when form is valid', () => {
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(true));

    component.onSubmit();

    expect(ticketServiceMock.checkTicket).toHaveBeenCalledWith(123, 456);
  });

  it('should set isTicketValid to true and isTicketInvalid to false on valid ticket', () => {
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(true));

    component.onSubmit();
    fixture.detectChanges();

    expect(component.isTicketValid).toBeTrue();
    expect(component.isTicketInvalid).toBeFalse();
  });

  it('should set isTicketValid to false and isTicketInvalid to true on invalid ticket', () => {
    component.ticketForm.controls['ticketId'].setValue('123');
    component.ticketForm.controls['vehicleNumber'].setValue('456');
    ticketServiceMock.checkTicket.and.returnValue(of(false));

    component.onSubmit();
    fixture.detectChanges();

    expect(component.isTicketValid).toBeFalse();
    expect(component.isTicketInvalid).toBeTrue();
  });

  it('should not call checkTicket on TicketService when form is invalid', () => {
    component.ticketForm.controls['ticketId'].setValue('');
    component.ticketForm.controls['vehicleNumber'].setValue('');

    component.onSubmit();

    expect(ticketServiceMock.checkTicket).not.toHaveBeenCalled();
  });
});
