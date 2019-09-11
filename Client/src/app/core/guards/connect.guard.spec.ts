import { TestBed, async, inject } from '@angular/core/testing';

import { ConnectGuard } from './connect.guard';

xdescribe('ConnectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectGuard]
    });
  });

  it('should ...', inject([ConnectGuard], (guard: ConnectGuard) => {
    expect(guard).toBeTruthy();
  }));
});
