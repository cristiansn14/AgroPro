import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearParcelaComponent } from './crear-parcela.component';

describe('CrearParcelaComponent', () => {
  let component: CrearParcelaComponent;
  let fixture: ComponentFixture<CrearParcelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearParcelaComponent]
    });
    fixture = TestBed.createComponent(CrearParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
