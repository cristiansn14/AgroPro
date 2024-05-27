import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-finca-create',
  templateUrl: './finca-create.component.html',
  styleUrls: ['./finca-create.component.scss']
})
export class FincaCreateComponent implements OnInit{
  propietariosForm!: FormGroup;
  numeroPropietarios: number = 0;
  propietarioRows: any[][] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([])
    });
  }

  get propietarios(): FormArray {
    return this.propietariosForm.get('propietarios') as FormArray;
  }

  generarFormularioPropietarios(){
    const cantidadActual = this.propietarios.length;

    if (this.numeroPropietarios > cantidadActual) {
      // Agregar nuevos formularios
      for (let i = cantidadActual; i < this.numeroPropietarios; i++) {
        this.propietarios.push(this.createPropietarioForm());
      }
    } else if (this.numeroPropietarios < cantidadActual) {
      // Eliminar formularios excedentes
      for (let i = cantidadActual; i > this.numeroPropietarios; i--) {
        this.propietarios.removeAt(i - 1);
      }
    }

    // Dividir los formularios en filas de 3
    this.propietarioRows = [];
    for (let i = 0; i < this.propietarios.length; i += 3) {
      this.propietarioRows.push(this.propietarios.controls.slice(i, i + 3));
    }
  } 

  createPropietarioForm(): FormGroup {
    const propietarioForm = this.fb.group({
      usuario: ['', Validators.required],
      participacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      administrador: [false],
      propietario: [false]
    });

    propietarioForm.get('administrador')?.valueChanges.subscribe(value => {
      if (value) {
        propietarioForm.get('propietario')?.setValue(false, { emitEvent: false });
      }
    });

    propietarioForm.get('propietario')?.valueChanges.subscribe(value => {
      if (value) {
        propietarioForm.get('administrador')?.setValue(false, { emitEvent: false });
      }
    });

    return propietarioForm;
  }
}
