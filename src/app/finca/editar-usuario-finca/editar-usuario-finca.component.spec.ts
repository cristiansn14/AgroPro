import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuarioFincaComponent } from './editar-usuario-finca.component';

describe('EditarUsuarioFincaComponent', () => {
  let component: EditarUsuarioFincaComponent;
  let fixture: ComponentFixture<EditarUsuarioFincaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarUsuarioFincaComponent]
    });
    fixture = TestBed.createComponent(EditarUsuarioFincaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
