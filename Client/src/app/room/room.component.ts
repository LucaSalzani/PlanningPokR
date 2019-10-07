import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './../auth/auth.service';
import { CommunicationHubService, NavigationUpdate } from '../core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  isModerator$: Observable<boolean>;

  private navigationUpdate$: Observable<NavigationUpdate>;
  private navigationUpdateSubscription: Subscription;
  private roomId: string;
  private userId: string;

  constructor(
    public communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private router: Router,
    authService: AuthService) {
      this.navigationUpdate$ = this.communicationHubService.getNavigationUpdate();
      this.navigationUpdateSubscription = this.navigationUpdate$.subscribe( navUpdate => this.navigate(navUpdate));
      this.userId = authService.getUserId();
  }

  async ngOnInit() {
    this.isModerator$ = this.communicationHubService.getParticipantsStateUpdate().pipe(
      map(update => {
        const user = update.participants.find(p => p.userId === this.userId);
        return user ? user.isModerator : false;
      }));

    this.roomId = this.route.snapshot.paramMap.get('roomid');
    await this.communicationHubService.enterRoomAsync(this.roomId);
  }

  navigate(navigationUpdate: NavigationUpdate) {
    switch (navigationUpdate.phase) {
      case 'backlog':
        this.router.navigate(['./backlog'], { relativeTo: this.route });
        break;
      case 'poker':
        this.router.navigate(['./poker'], { relativeTo: this.route, queryParams: { storyId: navigationUpdate.storyId } });
        break;
      default:
        break;
    }
  }

  async claimModerator() {
    await this.communicationHubService.claimModerator(this.roomId);
  }

  async ngOnDestroy() {
    await this.communicationHubService.leaveRoomAsync();
    this.navigationUpdateSubscription.unsubscribe();
  }

  async reconnect() {
    await this.communicationHubService.connect();
  }

  @HostListener('window:beforeunload')
  async onBrowserClose() {
    await this.communicationHubService.leaveRoomAsync();
    this.navigationUpdateSubscription.unsubscribe();
  }
}
