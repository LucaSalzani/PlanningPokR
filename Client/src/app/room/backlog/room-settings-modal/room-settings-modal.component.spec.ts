import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSettingsModalComponent } from './room-settings-modal.component';

xdescribe('RoomSettingsModalComponent', () => {
  let component: RoomSettingsModalComponent;
  let fixture: ComponentFixture<RoomSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
