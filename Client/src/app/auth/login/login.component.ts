import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName: string;
  catOfTheDayUrl: string;

  constructor(public authService: AuthService, public router: Router, private httpClient: HttpClient) {
    this.catOfTheDayUrl = 'assets/spinner_color.gif';
  }

  ngOnInit(): void {
    let parameters = new HttpParams();

    parameters = parameters.append('api_key', 'Mdnz1Kh8BM2mwraXadYAAL6Wvi9scfJu');
    parameters = parameters.append('tag', 'cat');
    parameters = parameters.append('rating', 'pg');

    this.httpClient.get<GiphyResponse>('http://api.giphy.com/v1/gifs/random', { params: parameters, responseType: 'json'})
    .subscribe(response => this.catOfTheDayUrl = response.data.images.fixed_height.url);
  }

  async login() {
    await this.authService.login(this.userName);
    if (this.authService.isLoggedIn) {
      const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/';
      this.router.navigateByUrl(redirect);
    }
  }
}

export interface GiphyResponse {
  data: {
    images: {
      fixed_height: {
        url: string;
      };
    };
  };
}
