import { TestBed } from '@angular/core/testing';

import { NodeAPIService } from './node-api.service';

describe('NodeAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeAPIService = TestBed.get(NodeAPIService);
    expect(service).toBeTruthy();
  });
});
