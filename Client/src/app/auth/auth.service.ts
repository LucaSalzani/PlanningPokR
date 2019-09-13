import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  jwt: string;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.jwt = localStorage.getItem('jwt');
    this.isLoggedIn = !!this.jwt; // TODO: Check validity
  }

  async login(userId: string, userName: string) {
    let parameters = new HttpParams();

    parameters = parameters.append('userId', userId);
    parameters = parameters.append('userName', userName);

    return await this.http.get<string>(`${environment.backendBaseUrl}api/auth`, { params: parameters, responseType: 'text' as 'json'})
    .toPromise().then((token: string) => { // TODO: Error handling
      this.isLoggedIn = true;
      this.jwt = token;
      localStorage.setItem('jwt', token);
    });
  }

  async logout() {
    this.isLoggedIn = false;
    this.jwt = undefined;
    localStorage.removeItem('jwt');
    await this.router.navigate(['/login']);
  }
}
