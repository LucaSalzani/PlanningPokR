import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { CommunicationHubService, NavigationUpdate } from '../core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  private navigationUpdate$: Observable<NavigationUpdate>;
  private navigationUpdateSubscription: Subscription;
  private roomId: string;

  constructor(private communicationHubService: CommunicationHubService, private route: ActivatedRoute, private router: Router) {
    this.navigationUpdate$ = this.communicationHubService.getNavigationUpdate();
    this.navigationUpdateSubscription = this.navigationUpdate$.subscribe( navUpdate => this.navigate(navUpdate));
  }

  async ngOnInit() {
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

  @HostListener('window:beforeunload')
  async onBrowserClose() {
    await this.communicationHubService.leaveRoomAsync();
    this.navigationUpdateSubscription.unsubscribe();
  }
}
