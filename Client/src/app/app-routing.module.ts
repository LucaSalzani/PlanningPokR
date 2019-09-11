import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyComponent } from './lobby';
import { RoomComponent, BacklogComponent, PokerComponent } from './room';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard], },
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
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
