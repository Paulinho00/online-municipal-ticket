import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../user/services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(public readonly authService:AuthService ){}
}
