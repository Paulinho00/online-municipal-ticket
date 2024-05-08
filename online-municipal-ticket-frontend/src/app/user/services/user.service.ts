import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';
import { LoginData } from '../model/login-data';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const authApiPrefix = '/api/login'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  getUser(): User | null {
    return JSON.parse(localStorage.getItem('user') ?? "null") as User;
  }

  getToken(): string {
    return localStorage.getItem('user') ?? " ";
  }

  login(loginData: LoginData): Observable<any> {
    return this.http.post<User>(authApiPrefix, loginData)
      .pipe(
        map(response => {
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('token', response.token);
        })
      );  
  }

  register(user: User): Observable<any>{
    return this.http.post(`${authApiPrefix}/register`, user, {responseType: 'text'});
  }

  logout():Observable<any>{
    return this.http.post(`${authApiPrefix}/logout`, this.getToken())
      .pipe(
        map(response => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        })
      );
  }
}
