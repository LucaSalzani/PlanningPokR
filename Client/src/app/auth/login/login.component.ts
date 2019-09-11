import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public userName: string;
  public userId: string;

  constructor(public authService: AuthService, public router: Router) {}

  async login() {
    await this.authService.login(this.userId, this.userName);
    if (this.authService.isLoggedIn) {
      const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/';
      this.router.navigateByUrl(redirect);
    }
  }
}
