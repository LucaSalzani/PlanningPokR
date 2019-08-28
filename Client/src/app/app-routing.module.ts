import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyComponent } from './lobby';
import { RoomComponent } from './room';

const routes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'room', component: RoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
