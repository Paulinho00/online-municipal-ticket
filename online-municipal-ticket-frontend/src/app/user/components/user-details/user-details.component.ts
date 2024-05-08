import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { UserRole } from '../../model/user-role';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  user: User;
  userRole: string;

  constructor(private readonly userService: UserService) {
    this.user = userService.getUser()!;
    if(this.user.role == UserRole.Passenger){
      this.userRole = "Pasażer";
    }
    else{
      this.userRole = "Kontroler "
    }
  }

}
