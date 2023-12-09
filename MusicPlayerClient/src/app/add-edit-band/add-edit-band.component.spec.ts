import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBandComponent } from './add-edit-band.component';

describe('AddEditBandComponent', () => {
  let component: AddEditBandComponent;
  let fixture: ComponentFixture<AddEditBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
