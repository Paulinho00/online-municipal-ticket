import { Injectable, signal } from '@angular/core';
import { User } from '../model/user';
import { LoginData } from '../model/login-data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const authApiPrefix = '/api/login'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  login(loginData: LoginData): Observable<User> {
    return this.http.post<User>(authApiPrefix, loginData);  
  }

  register(user: User): Observable<any>{
    return this.http.post(`${authApiPrefix}/register`, user, {responseType: 'text'});
  }

  logout():Observable<any>{
    return this.http.post(`${authApiPrefix}/logout`, "");
  }
}
