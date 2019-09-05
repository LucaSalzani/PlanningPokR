import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby';
import { RoomComponent } from './room';
import { ParticipantListComponent } from './room/participant-list';
import { BacklogComponent } from './room/backlog/backlog.component';
import { PokerComponent } from './room/poker/poker.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    RoomComponent,
    ParticipantListComponent,
    BacklogComponent,
    PokerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
