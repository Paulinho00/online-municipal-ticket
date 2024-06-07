import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';
import { LoginData } from '../model/login-data';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

const authApiPrefix = '/api/login'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = new BehaviorSubject<User | undefined>(this.getUser());

  constructor(private readonly http: HttpClient) { }

  getUser(): User {
    return JSON.parse(sessionStorage.getItem('user') ?? "null") as User;
  }

  getToken(): string {
    return sessionStorage.getItem('user') ?? " ";
  }

  login(loginData: LoginData): Observable<any> {
    return this.http.post<User>(authApiPrefix, loginData)
      .pipe(
        map(response => {
          sessionStorage.setItem('user', JSON.stringify(response));
          sessionStorage.setItem('token', response.token);
          this.currentUser.next(response)
        })
      );  
  }

  register(user: User): Observable<any>{
    return this.http.post(`${authApiPrefix}/register`, user, {responseType: 'text'});
  }

  logout():Observable<any>{
    return this.http.post(`${authApiPrefix}/logout`, "")
      .pipe(
        map(() => {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          this.currentUser.next(undefined)
        })
      );
  }
}
