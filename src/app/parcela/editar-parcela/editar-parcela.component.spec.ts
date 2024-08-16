import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarParcelaComponent } from './editar-parcela.component';

describe('EditarParcelaComponent', () => {
  let component: EditarParcelaComponent;
  let fixture: ComponentFixture<EditarParcelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarParcelaComponent]
    });
    fixture = TestBed.createComponent(EditarParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
