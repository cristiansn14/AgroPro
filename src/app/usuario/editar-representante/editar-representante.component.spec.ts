import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRepresentanteComponent } from './editar-representante.component';

describe('EditarRepresentanteComponent', () => {
  let component: EditarRepresentanteComponent;
  let fixture: ComponentFixture<EditarRepresentanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarRepresentanteComponent]
    });
    fixture = TestBed.createComponent(EditarRepresentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
