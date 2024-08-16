import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLiquidacionesComponent } from './listar-liquidaciones.component';

describe('ListarLiquidacionesComponent', () => {
  let component: ListarLiquidacionesComponent;
  let fixture: ComponentFixture<ListarLiquidacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarLiquidacionesComponent]
    });
    fixture = TestBed.createComponent(ListarLiquidacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
