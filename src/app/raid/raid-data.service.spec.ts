import { TestBed, inject } from '@angular/core/testing';

import { RaidDataService } from './raid-data.service';

describe('RaidDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaidDataService]
    });
  });

  it('should be created', inject([RaidDataService], (service: RaidDataService) => {
    expect(service).toBeTruthy();
  }));
});
