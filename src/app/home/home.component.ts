import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  username = '';

  constructor (private tokenService: TokenService) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.username = this.tokenService.getUserName() ?? '';
    } else {
      this.username = '';
    }
  }
}
