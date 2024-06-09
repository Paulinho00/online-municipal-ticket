import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserLoginControllerService } from '../../api/services';
import { AuthRequest, LoginReply, RegistrationForm } from '../../api/models';
import { Login$Params } from '../../api/fn/user-login-controller/login';
import { Register$Params } from '../../api/fn/user-login-controller/register';

const authApiPrefix = '/api/login'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = new BehaviorSubject<LoginReply | undefined>(this.getUser());

  constructor(
    private readonly loginControllerService: UserLoginControllerService) { }

  getUser(): LoginReply {
    return JSON.parse(sessionStorage.getItem('user') ?? "null") as LoginReply;
  }

  getToken(): string {
    return sessionStorage.getItem('token') ?? " ";
  }

  login(loginData: AuthRequest): Observable<void> {

    return this.loginControllerService.login({body: loginData})
      .pipe(
        map(response => {
          sessionStorage.setItem('user', JSON.stringify(response));
          sessionStorage.setItem('token', response.token!);
          this.currentUser.next(response);
        })
      );  
  }

  register(user: RegistrationForm): Observable<any>{
    return this.loginControllerService.register({body: user})
  }

  logout():Observable<any>{
    return this.loginControllerService.logout({token: this.getToken()})
      .pipe(
        map(() => {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          this.currentUser.next(undefined)
        })
      );
  }
}
