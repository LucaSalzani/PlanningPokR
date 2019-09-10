import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(public authService: AuthService, public router: Router) {}

  login() {
    this.authService.login();
    if (this.authService.isLoggedIn) {
      const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/';
      this.router.navigateByUrl(redirect);
    }
  }
}
