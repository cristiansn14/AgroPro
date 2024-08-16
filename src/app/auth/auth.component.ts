import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';
import { TokenService } from '../service/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit{

  loginRequest: LoginRequest | undefined;
  username: string = "";
  password: string = "";
  error: string = "";
  roles: string[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
    this.error = "";
  }

  login(){

    const usernameHtml = document.getElementById('username') as HTMLInputElement;
    const passwordHtml = document.getElementById('password') as HTMLInputElement;

    this.username = usernameHtml.value;
    this.password = passwordHtml.value;

    this.loginRequest = new LoginRequest(this.username, this.password);
    this.authService.login(this.loginRequest).subscribe({
      next: (data) => {
        this.tokenService.setToken(data.token);
        this.tokenService.setUserId(data.id);
        this.tokenService.setUserName(data.username);
        this.tokenService.setAuthorities(data.roles);
        this.toastr.success('Bienvenido ' + data.username, 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });

        this.router.navigateByUrl('/dashboard/home');
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Usuario o contraseña erróneos', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    })    
  }
}
