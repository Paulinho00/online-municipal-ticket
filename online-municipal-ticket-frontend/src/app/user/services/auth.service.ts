import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentSignedUser = signal<User | undefined | null>(undefined)
  constructor() { }
}
