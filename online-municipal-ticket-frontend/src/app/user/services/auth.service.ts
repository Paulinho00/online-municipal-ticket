import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getUser(): User | undefined | null {
    return JSON.parse(localStorage.getItem('user') ?? "null") as User;
  }

  setUser(user:User){
    localStorage.setItem('user', JSON.stringify(user));
  }
}
