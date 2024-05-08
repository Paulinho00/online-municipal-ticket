import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../user/services/auth.service';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(public readonly authService:AuthService, private readonly router: Router, private readonly userService: UserService ){}

  logOut(){
    this.userService.logout();
    this.authService.logoutUser();
    this.router.navigateByUrl('/login');
  }
}
