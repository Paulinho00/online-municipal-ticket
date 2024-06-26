import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketPurchaseComponent } from './ticket-purchase.component';
import { TicketService } from '../../services/ticket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TicketModel } from '../../../api/models';
import { TicketType } from '../../model/ticket-type';
import { TicketTypePipe } from '../../services/ticket-type-pipe';

describe('TicketPurchaseComponent', () => {
  let component: TicketPurchaseComponent;
  let fixture: ComponentFixture<TicketPurchaseComponent>;
  let ticketServiceMock: any;

  const mockTicketModels: TicketModel[] = [
    { id: 1, type: TicketType.Periodic, price: 30.00, isReduced: false},
    { id: 2, type: TicketType.Timed, price: 2.50, isReduced: false},
    { id: 3, type: TicketType.Disposable, price: 5.00, isReduced: false}
  ];

  beforeEach(async () => {
    ticketServiceMock = jasmine.createSpyObj('TicketService', ['getTicketModels', 'buyTicket']);
    ticketServiceMock.getTicketModels.and.returnValue(of(mockTicketModels));

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TicketPurchaseComponent],
      providers: [
        { provide: TicketService, useValue: ticketServiceMock },
        TicketTypePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available ticket models on init', () => {
    // then
    expect(ticketServiceMock.getTicketModels).toHaveBeenCalled();
    expect(component.availableTicketModels).toEqual(mockTicketModels);
  });

  it('should select default ticket model after init', () => {
    // then
    expect(component.selectedTicketModel).toEqual(mockTicketModels[0]);
  });

  it('should successfully complete transaction for timed ticket', () => {
    // given
    const mockResponse = { status: 200 };
    component.startDate = '2024-06-01T00:00:00';

    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    component.startDate = futureDate.toISOString();

    component.selectedTicketModel = mockTicketModels[1];

    // when
    ticketServiceMock.buyTicket.and.returnValue(of(mockResponse));
    component.onSubmit();

    // then
    expect(ticketServiceMock.buyTicket).toHaveBeenCalledWith(mockTicketModels[1].id, jasmine.any(Number));
    expect(component.isTransactionSuccesful).toBeTrue();
  });

  it('should successfully complete transaction for disposable ticket', () => {
    // given
    const mockResponse = { status: 200 };
    component.startDate = '2024-06-01T00:00:00';
    component.selectedTicketModel = mockTicketModels[2];

    // when
    ticketServiceMock.buyTicket.and.returnValue(of(mockResponse));
    component.onSubmit();

    // then
    expect(ticketServiceMock.buyTicket).toHaveBeenCalledWith(mockTicketModels[2].id, jasmine.any(Number));
    expect(component.isTransactionSuccesful).toBeTrue();
  });

  it('should successfully complete transaction for periodic ticket', () => {
    // given
    const mockResponse = { status: 200 };
    component.startDate = '2024-06-01T00:00:00';
    component.selectedTicketModel = mockTicketModels[0];

    // when
    ticketServiceMock.buyTicket.and.returnValue(of(mockResponse));
    component.onSubmit();

    // then
    expect(ticketServiceMock.buyTicket).toHaveBeenCalledWith(mockTicketModels[0].id, jasmine.any(Number));
    expect(component.isTransactionSuccesful).toBeTrue();
  });

  it('should display error message for wrong dates', () => {
    // given
    component.startDate = '2020-01-01T00:00:00'; // earlier date
    component.selectedTicketModel = mockTicketModels[1];

    // when
    component.onSubmit();

    // then
    expect(component.wrongDates).toBeTrue();
  });

});
