import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyComponent } from './lobby.component';
import { CommunicationHubService } from '../core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;
  const spy = jasmine.createSpyObj('CommunicationHubService', ['connect', 'createParticipantAsync']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      declarations: [ LobbyComponent ],
      providers: [{provide: CommunicationHubService, useValue: spy}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
