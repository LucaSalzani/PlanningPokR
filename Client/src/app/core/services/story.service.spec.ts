import { TestBed } from '@angular/core/testing';

import { StoryService } from './story.service';

xdescribe('StoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoryService = TestBed.get(StoryService);
    expect(service).toBeTruthy();
  });
});
