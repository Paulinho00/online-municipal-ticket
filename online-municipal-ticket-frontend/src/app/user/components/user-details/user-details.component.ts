import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../model/user-role';
import { LoginReply } from '../../../api/models';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  user!: LoginReply;
  userRole!: string;

  constructor(private readonly userService: UserService) {
    this.userService.currentUser.subscribe(res =>
      {
      if(res != undefined){
        this.user = res
        if(this.user.role == UserRole.Passenger){
          this.userRole = "Pasażer";
        }
        else{
          this.userRole = "Kontroler "
        }
      }
    });

  }

}
