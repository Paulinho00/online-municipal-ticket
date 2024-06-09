import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetailsComponent } from './ticket-details.component';
import { DatePipe } from '@angular/common';
import { TicketTypePipe } from '../../services/ticket-type-pipe';
import { Ticket } from '../../../api/models/ticket';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TicketType } from '../../model/ticket-type';
import { TicketModel } from '../../../api/models';

describe('TicketDetailsComponent', () => {
  let component: TicketDetailsComponent;
  let fixture: ComponentFixture<TicketDetailsComponent>;
  let datePipeMock: jasmine.SpyObj<DatePipe>;
  let ticketTypePipeMock: jasmine.SpyObj<TicketTypePipe>;

  beforeEach(async () => {
    datePipeMock = jasmine.createSpyObj('DatePipe', ['transform']);
    ticketTypePipeMock = jasmine.createSpyObj('TicketTypePipe', ['transform']);

    await TestBed.configureTestingModule({
      imports: [TicketDetailsComponent],
      providers: [
        { provide: DatePipe, useValue: datePipeMock },
        { provide: TicketTypePipe, useValue: ticketTypePipeMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailsComponent);
    component = fixture.componentInstance;

    component.ticket = {
      id: 1,
      type: TicketType.Periodic,
      activationDate: '2024-05-01T00:00:00',
      validUntil: '2024-06-01T00:00:00',
      isDiscounted: false
    } as Ticket;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly format date string', () => {
    // given
    const dateTimeString = '2024-05-19T14:00:00';
    const formattedDate = '19.05.2024 14:00';
    
    // when
    datePipeMock.transform.and.returnValue(formattedDate);
    const result = component.formatDateString(dateTimeString);

    // then
    expect(datePipeMock.transform).toHaveBeenCalledWith(dateTimeString, 'dd.MM.yyyy HH:mm');
    expect(result).toBe(formattedDate);
  });

  it('should set ticket input correctly', () => {
    // given
    const ticket: Ticket = {
      id: 1,
      type: TicketType.Periodic,
      purchaseDate: '2024-05-01T00:00:00',
      activationDate: '2024-05-01T00:00:00'
    };
    component.ticket = ticket;

    // when
    fixture.detectChanges();

    // then
    expect(component.ticket).toBe(ticket);
  });

  it('should display "nieskasowany" when activationDate is not set', () => {
    // given
    component.ticket.type = TicketType.Disposable;
    component.ticket.activationDate = '';

    // when
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const activationDateElement = compiled.querySelector('[data-testid="activation-date-disposable"]') as HTMLElement;
    
    // then
    expect(activationDateElement?.textContent).toContain('nieskasowany');
  });

  it('should correctly display ticket type', () => {
    // given
    const ticketTypeTransformed = 'Okresowy';
    ticketTypePipeMock.transform.and.returnValue(ticketTypeTransformed);
  
    // when
    component.ticket.type = TicketType.Periodic;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const ticketHeader = compiled.querySelector('[data-testid="ticket-header"]') as HTMLElement;
  
    // then
    expect(ticketTypePipeMock.transform).toHaveBeenCalledWith(TicketType.Periodic);
    expect(ticketHeader?.textContent).toContain(`Bilet ${ticketTypeTransformed}`);
  });
});
