import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: HubConnection;
  public message = 'I say: ';

  ngOnInit(): void {
    this.hubConnection = new HubConnectionBuilder().withUrl('https://localhost:5001/communicationHub').build(); // TODO: Get from config

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :(', err));

    this.hubConnection.on('sendToAll', payload => this.message += payload);
  }
}
