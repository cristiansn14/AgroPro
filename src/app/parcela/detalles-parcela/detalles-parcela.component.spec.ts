import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesParcelaComponent } from './detalles-parcela.component';

describe('DetallesParcelaComponent', () => {
  let component: DetallesParcelaComponent;
  let fixture: ComponentFixture<DetallesParcelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesParcelaComponent]
    });
    fixture = TestBed.createComponent(DetallesParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
