import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby';
import { RoomComponent } from './room';
import { ParticipantListComponent } from './room/participant-list';
import { BacklogComponent } from './room/backlog';
import { PokerComponent } from './room/poker';
import { LoginComponent } from './auth/login';
import { VotingResultComponent } from './room/poker/voting-result/voting-result.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    RoomComponent,
    ParticipantListComponent,
    BacklogComponent,
    PokerComponent,
    LoginComponent,
    VotingResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
