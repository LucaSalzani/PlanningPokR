import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyComponent } from './lobby';
import { RoomComponent, BacklogComponent, PokerComponent } from './room';

const routes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  {
    path: 'room/:roomid', component: RoomComponent,
    children: [
      { path: 'backlog', component: BacklogComponent },
      { path: 'poker', component: PokerComponent },
      { path: '', redirectTo: 'backlog', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
