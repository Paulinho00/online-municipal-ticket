import { Component } from '@angular/core';
import { UserService } from '../user/services/user.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(public readonly userService:UserService ){}
}
