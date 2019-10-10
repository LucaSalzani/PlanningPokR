import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby';
import { RoomComponent } from './room';
import { ParticipantListComponent } from './room/participant-list';
import { BacklogComponent, AddStoryManuallyModalComponent, AddStoryJiraModalComponent } from './room/backlog';
import { PokerComponent, VotingResultComponent } from './room/poker';
import { LoginComponent } from './auth/login';
import { RoomSettingsModalComponent } from './room/backlog/room-settings-modal/room-settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    RoomComponent,
    ParticipantListComponent,
    BacklogComponent,
    PokerComponent,
    LoginComponent,
    VotingResultComponent,
    AddStoryManuallyModalComponent,
    AddStoryJiraModalComponent,
    RoomSettingsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddStoryManuallyModalComponent,
    AddStoryJiraModalComponent,
    RoomSettingsModalComponent
  ]
})
export class AppModule { }
