import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelaCreateComponent } from './parcela-create.component';

describe('ParcelaCreateComponent', () => {
  let component: ParcelaCreateComponent;
  let fixture: ComponentFixture<ParcelaCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelaCreateComponent]
    });
    fixture = TestBed.createComponent(ParcelaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
