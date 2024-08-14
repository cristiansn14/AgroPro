import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRepresentanteComponent } from './crear-representante.component';

describe('CrearRepresentanteComponent', () => {
  let component: CrearRepresentanteComponent;
  let fixture: ComponentFixture<CrearRepresentanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearRepresentanteComponent]
    });
    fixture = TestBed.createComponent(CrearRepresentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
