import { Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { RegisterComponent } from './user/components/register/register.component';
import { UserDetailsComponent } from './user/components/user-details/user-details.component';
import { TicketListComponent } from './tickets/components/ticket-list/ticket-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'user-details', component: UserDetailsComponent},
    { path: 'ticket-list', component: TicketListComponent}
];
