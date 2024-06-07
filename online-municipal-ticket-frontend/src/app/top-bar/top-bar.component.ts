import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user/services/user.service';
import { response } from 'express';
import { User } from '../user/model/user';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  public currentUser: User | undefined;
  constructor( private readonly router: Router, private readonly userService: UserService ){
    this.userService.currentUser.subscribe(res =>
      {
        this.currentUser= res;
      });
  }

  logOut(){
    this.userService.logout().subscribe(response => {
      this.router.navigateByUrl('/login');
    });
  }
}
