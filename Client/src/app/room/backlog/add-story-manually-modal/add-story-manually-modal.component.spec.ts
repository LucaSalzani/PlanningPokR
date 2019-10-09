import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryManuallyModalComponent } from './add-story-manually-modal.component';

xdescribe('AddStoryManuallyModalComponent', () => {
  let component: AddStoryManuallyModalComponent;
  let fixture: ComponentFixture<AddStoryManuallyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoryManuallyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoryManuallyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
