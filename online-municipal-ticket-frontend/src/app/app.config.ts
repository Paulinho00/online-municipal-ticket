import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './user/services/auth.interceptor';
import { DatePipe } from '@angular/common';
import { TicketTypePipe } from './tickets/services/ticket-type-pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
    DatePipe,
    TicketTypePipe
  ]
};
