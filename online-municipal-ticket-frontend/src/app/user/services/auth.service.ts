import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getUser(): User | undefined | null {
    return JSON.parse(localStorage.getItem('user') ?? "null") as User;
  }

  loginUser(user:User){
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
  }

  logoutUser(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
