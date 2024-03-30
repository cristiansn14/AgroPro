import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FincaCreateComponent } from './finca-create.component';

describe('FincaCreateComponent', () => {
  let component: FincaCreateComponent;
  let fixture: ComponentFixture<FincaCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FincaCreateComponent]
    });
    fixture = TestBed.createComponent(FincaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
