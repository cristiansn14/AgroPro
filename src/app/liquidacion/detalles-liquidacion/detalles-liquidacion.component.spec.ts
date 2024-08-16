import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesLiquidacionComponent } from './detalles-liquidacion.component';

describe('DetallesLiquidacionComponent', () => {
  let component: DetallesLiquidacionComponent;
  let fixture: ComponentFixture<DetallesLiquidacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesLiquidacionComponent]
    });
    fixture = TestBed.createComponent(DetallesLiquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
