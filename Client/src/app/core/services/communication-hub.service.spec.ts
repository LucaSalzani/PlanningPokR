import { TestBed } from '@angular/core/testing';

import { CommunicationHubService } from './communication-hub.service';

xdescribe('CommunicationHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommunicationHubService = TestBed.get(CommunicationHubService);
    expect(service).toBeTruthy();
  });
});
