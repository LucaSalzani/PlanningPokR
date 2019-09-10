import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  jwt: string;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: HttpClient) {
    this.jwt = localStorage.getItem('jwt');
    this.isLoggedIn = !!this.jwt; // TODO: Check validity
  }

  login() {
    let parameters = new HttpParams();

    parameters = parameters.append('userId', 'userIdValue');
    parameters = parameters.append('userName', 'userNameValue');
    this.isLoggedIn = true; // TODO: Only if request ok

    this.http.get<string>('https://localhost:5001/api/auth', { params: parameters, responseType: 'text' as 'json'})
    .subscribe((token: string) => {
      this.isLoggedIn = true;
      this.jwt = token;
      localStorage.setItem('jwt', token);
    });
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
