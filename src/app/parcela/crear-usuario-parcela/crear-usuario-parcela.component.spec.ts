import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuarioParcelaComponent } from './crear-usuario-parcela.component';

describe('CrearUsuarioParcelaComponent', () => {
  let component: CrearUsuarioParcelaComponent;
  let fixture: ComponentFixture<CrearUsuarioParcelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearUsuarioParcelaComponent]
    });
    fixture = TestBed.createComponent(CrearUsuarioParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
