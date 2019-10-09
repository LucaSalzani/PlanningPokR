import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryJiraModalComponent } from './add-story-jira-modal.component';

xdescribe('AddStoryJiraModalComponent', () => {
  let component: AddStoryJiraModalComponent;
  let fixture: ComponentFixture<AddStoryJiraModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoryJiraModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoryJiraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
