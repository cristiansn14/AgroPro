import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesFincaComponent } from './detalles-finca.component';

describe('DetallesFincaComponent', () => {
  let component: DetallesFincaComponent;
  let fixture: ComponentFixture<DetallesFincaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesFincaComponent]
    });
    fixture = TestBed.createComponent(DetallesFincaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
