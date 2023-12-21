import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { superuserGuard } from './superuser.guard';

describe('superuserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => superuserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
