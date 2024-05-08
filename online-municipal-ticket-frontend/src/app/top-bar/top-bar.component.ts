import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user/services/user.service';
import { response } from 'express';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor( private readonly router: Router, public readonly userService: UserService ){}

  logOut(){
    this.userService.logout().subscribe(response => {
      this.router.navigateByUrl('/login');
    });
  }
}
