import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesUsuarioComponent } from './detalles-usuario.component';

describe('DetallesUsuarioComponent', () => {
  let component: DetallesUsuarioComponent;
  let fixture: ComponentFixture<DetallesUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesUsuarioComponent]
    });
    fixture = TestBed.createComponent(DetallesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
