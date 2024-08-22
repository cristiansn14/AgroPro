import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarArchivosComponent } from './listar-archivos.component';

describe('ListarArchivosComponent', () => {
  let component: ListarArchivosComponent;
  let fixture: ComponentFixture<ListarArchivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarArchivosComponent]
    });
    fixture = TestBed.createComponent(ListarArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
