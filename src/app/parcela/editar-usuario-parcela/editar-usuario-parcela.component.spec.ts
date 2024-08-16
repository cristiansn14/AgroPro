import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuarioParcelaComponent } from './editar-usuario-parcela.component';

describe('EditarUsuarioParcelaComponent', () => {
  let component: EditarUsuarioParcelaComponent;
  let fixture: ComponentFixture<EditarUsuarioParcelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarUsuarioParcelaComponent]
    });
    fixture = TestBed.createComponent(EditarUsuarioParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
