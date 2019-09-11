import { Component, OnInit } from '@angular/core';
import { CommunicationHubService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {
  private roomId: string;

  constructor(private communicationHubService: CommunicationHubService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomid');
  }

  async selectValue(value: number) {
    await this.communicationHubService.selectValueAsync(value, this.roomId);
  }

  async revealVotes() {
    await this.communicationHubService.revealVotes(this.roomId);
  }
}
