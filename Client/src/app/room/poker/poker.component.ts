import { Component, OnInit } from '@angular/core';
import { CommunicationHubService } from 'src/app/core/services';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent {

  constructor(private communicationHubService: CommunicationHubService) { }

  async selectValue(value: number) {
    await this.communicationHubService.selectValueAsync(value);
  }

  async revealVotes() {
    await this.communicationHubService.revealVotes();
  }
}
