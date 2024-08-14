import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFincaComponent } from './editar-finca.component';

describe('EditarFincaComponent', () => {
  let component: EditarFincaComponent;
  let fixture: ComponentFixture<EditarFincaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarFincaComponent]
    });
    fixture = TestBed.createComponent(EditarFincaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
