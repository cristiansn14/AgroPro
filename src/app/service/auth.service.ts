import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';
import { Observable } from 'rxjs';
import { JwtResponse } from '../model/jwt-response';
import { TokenService } from './token.service';
import { ChangePassword } from '../model/changePassword';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = 'http://localhost:8090/auth';

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  public signup (signup: SignupRequest[]): Observable<any> {
    return this.httpClient.post<any>(this.authURL + '/signup', signup)
  }

  public login (login: LoginRequest): Observable<any> {
    return this.httpClient.post<JwtResponse>(this.authURL + '/login', login)
  }

  public changePassword (changePasswordRequest: ChangePassword): Observable<any> {
    return this.httpClient.post<any>(this.authURL + '/changePassword', changePasswordRequest)
  }

}
