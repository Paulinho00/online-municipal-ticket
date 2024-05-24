import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../../services/ticket.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TicketType } from '../../model/ticket-type';
import { DatePipe } from '@angular/common';
import { TicketTypePipe } from '../../services/ticket-type-pipe';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let ticketServiceMock: any;

  const mockResponsePage1 = {
    totalPages: 2,
    tickets: [
      { id: '1', type: TicketType.Periodic, isDiscounted: false, purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined },
      { id: '2', type: TicketType.Timed, isDiscounted: true, purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined },
    ]
  };

  const mockResponsePage2 = {
    totalPages: 2,
    tickets: [
      { id: '3', type: TicketType.Disposable, isDiscounted: true, purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined },
      { id: '4', type: TicketType.Periodic, isDiscounted: false, 
      purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined }
    ]
  };

  beforeEach(async () => {
    ticketServiceMock = jasmine.createSpyObj('TicketService', ['getTickets']);

    await TestBed.configureTestingModule({
      imports: [TicketListComponent, HttpClientTestingModule],
      providers: [
        { provide: TicketService, useValue: ticketServiceMock },
        DatePipe,
        TicketTypePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load first page of tickets on init', () => {
    // when
    ticketServiceMock.getTickets.and.returnValue(of(mockResponsePage1));
    component.ngOnInit();
    fixture.detectChanges();

    // then
    expect(ticketServiceMock.getTickets).toHaveBeenCalledWith(0, 2);
    expect(component.tickets).toEqual(mockResponsePage1.tickets);
    expect(component.hasNextPage).toBeTrue();
    expect(component.hasPreviousPage).toBeFalse();
    expect(component.isListEmpty).toBeFalse();
  });

  it('should load second page of tickets on page change', () => {
    // when
    ticketServiceMock.getTickets.and.callFake((page: number, size: number) => {
      if (page === 0) {
        return of(mockResponsePage1);
      } else if (page === 1) {
        return of(mockResponsePage2);
      }
      return of({ totalPages: 0, tickets: [] });
    });
    component.changePage(1);
    fixture.detectChanges();
    
    // then
    expect(ticketServiceMock.getTickets).toHaveBeenCalledWith(1, 2);
    expect(component.tickets).toEqual(mockResponsePage2.tickets);
    expect(component.hasNextPage).toBeFalse();
    expect(component.hasPreviousPage).toBeTrue();
    expect(component.isListEmpty).toBeFalse();
  });

  it('should handle empty ticket list', () => {
    // given
    const mockEmptyResponse = {
      totalPages: 0,
      tickets: []
    };

    // when
    ticketServiceMock.getTickets.and.returnValue(of(mockEmptyResponse));
    component.ngOnInit();
    fixture.detectChanges();

    // then
    expect(ticketServiceMock.getTickets).toHaveBeenCalledWith(0, 2);
    expect(component.tickets).toEqual([]);
    expect(component.hasNextPage).toBeFalse();
    expect(component.hasPreviousPage).toBeFalse();
    expect(component.isListEmpty).toBeTrue();
  });

  it('should set hasNextPage and hasPreviousPage to false when there is only one page of tickets', () => {
    // given
    const mockResponsePage = {
      totalPages: 1,
      tickets: [
        { id: '1', type: TicketType.Periodic, isDiscounted: false, purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined },
        { id: '2', type: TicketType.Timed, isDiscounted: true, purchaseDate: '2024-05-19T14:00:00', activationDate: '', validUntil: '', vehicleId: undefined }
      ]
    };

    // when
    ticketServiceMock.getTickets.and.returnValue(of(mockResponsePage));
    component.ngOnInit();
    fixture.detectChanges();

    // then
    expect(component.hasNextPage).toBeFalse();
    expect(component.hasPreviousPage).toBeFalse();
  });
});
