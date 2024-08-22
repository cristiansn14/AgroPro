import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { superAccessGuard } from './super-access.guard';

describe('superAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => superAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
