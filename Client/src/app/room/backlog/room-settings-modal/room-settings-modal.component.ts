import { Subscription } from 'rxjs';
import { CommunicationHubService } from './../../../core/services';
import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RoomSettingsUpdate } from 'src/app/core';

@Component({
  selector: 'app-room-settings-modal',
  templateUrl: './room-settings-modal.component.html',
  styleUrls: ['./room-settings-modal.component.scss']
})
export class RoomSettingsModalComponent implements OnDestroy {
  settings: RoomSettingsUpdate;
  settingsSubscription: Subscription;

  constructor(public activeModal: NgbActiveModal, private communicationHubService: CommunicationHubService) {
    this.settingsSubscription = this.communicationHubService.getRoomSettingsUpdate().subscribe(update => {
      this.settings = Object.assign({}, update);
    });
  }

  async saveAndClose() {
    this.activeModal.close(this.settings);
  }

  isNumeric(input: string) {
    return ((input != null) && !isNaN(Number(input)));
  }

  canSave() {
    if (!this.settings.teamJiraLabel) {
      return false;
    }

    if (this.settings.votingOptions.filter(v => v.isActive).length <= 1) {
      return false;
    }

    return true;
  }

  ngOnDestroy(): void {
    this.settingsSubscription.unsubscribe();
  }
}
