import { CommunicationHubService } from 'src/app/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectGuard implements CanActivate, CanActivateChild {

  constructor(private communicationHubService: CommunicationHubService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.communicationHubService.isConnected()) {
      await this.communicationHubService.connect();
    }
    return this.communicationHubService.isConnected();
  }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
}
