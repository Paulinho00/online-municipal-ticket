import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentSignedUser = signal<User | undefined | null>(undefined)
  constructor() { }
}
