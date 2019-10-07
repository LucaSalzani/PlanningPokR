import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingResultComponent } from './voting-result.component';

xdescribe('VotingResultComponent', () => {
  let component: VotingResultComponent;
  let fixture: ComponentFixture<VotingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
