import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFincasComponent } from './listar-fincas.component';

describe('ListarFincasComponent', () => {
  let component: ListarFincasComponent;
  let fixture: ComponentFixture<ListarFincasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarFincasComponent]
    });
    fixture = TestBed.createComponent(ListarFincasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
