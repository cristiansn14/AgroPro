import { Component, OnInit } from '@angular/core';
import { Subparcela } from '../model/subparcela';
import { Parcela } from '../model/parcela';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-parcela-create',
  templateUrl: './parcela-create.component.html',
  styleUrls: ['./parcela-create.component.scss']
})


export class ParcelaCreateComponent implements OnInit {
  propietariosForm!: FormGroup;
  subparcelasForm!: FormGroup;
  propietarioRows: any[][] = [];
  subparcelaRows: any[] = [];
  tipoParcela: string = '';
  numeroSubparcelas: number = 0;
  numeroPropietarios: number = 0;
  parcela: any[] = [{ referenciaCatastral: '', poligono: '', parcela: '', paraje: '', clase: '', usoPrincipal: '', superficie: '', valorSuelo: '', valorConstruccion: '', valorCatastral: '', añoValor: '' }];
  parcelaConstruccion: any[] = [{ referenciaCatastral: '', superficie: '', escalera: '', planta: '', puerta: '', tipoReforma: '', fechaReforma: '' }];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tipoParcela = '';
    this.parcela = [];

    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([])
    });

    this.subparcelasForm = this.fb.group({
      subparcelas: this.fb.array([])
    })
  }

  get propietarios(): FormArray {
    return this.propietariosForm.get('propietarios') as FormArray;
  }

  get subparcelas(): FormArray {
    return this.subparcelasForm.get('subparcelas') as FormArray;
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
      participacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    return propietarioForm;
  }

  generarFormularioParcela(){
    this.parcela = [];
    this.parcelaConstruccion = [];
    this.parcela.push({ referenciaCatastral: '', poligono: '', parcela: '', paraje: '', clase: '', usoPrincipal: '', superficie: '', valorSuelo: '', valorConstruccion: '', valorCatastral: '', añoValor: '' })
    this.parcelaConstruccion.push({ referenciaCatastral: '', superficie: '', escalera: '', planta: '', puerta: '', tipoReforma: '', fechaReforma: '' });
  }

  generarFormularioSubparcela(){
    const cantidadActual = this.subparcelas.length;

    if (this.numeroSubparcelas > cantidadActual) {
      // Agregar nuevos formularios
      for (let i = cantidadActual; i < this.numeroSubparcelas; i++) {
        this.subparcelas.push(this.createSubparcelaForm());
      }
    } else if (this.numeroSubparcelas < cantidadActual) {
      // Eliminar formularios excedentes
      for (let i = cantidadActual; i > this.numeroSubparcelas; i--) {
        this.subparcelas.removeAt(i - 1);
      }
    }

   // Actualizar el array subparcelaRows
   this.subparcelaRows = [];
   let row = [];
   for (let i = 0; i < this.subparcelas.length; i++) {
     row.push(this.subparcelas.controls[i]);
     if (row.length === 3 || i === this.subparcelas.length - 1) {
       this.subparcelaRows.push(row);
       row = [];
     }
   }
  }

  createSubparcelaForm(): FormGroup {
    const subparcelaForm = this.fb.group({
      cultivoCatastro: ['', Validators.required],
      intensidadCatastro: ['', Validators.required],
      superficieCatastro: ['', Validators.required],
      cultivoSigpac: ['', Validators.required],
      intensidadSigpac: ['', Validators.required],
      superficieSigpac: ['', Validators.required]
    });

    return subparcelaForm;
  }

  guardar():void{
    for(let i = 0; i < this.numeroSubparcelas; i++){
      let s: Subparcela = new Subparcela;
      //s.cultivoCatastro = this.subparcelas[i].cultivoCatastro;
      // this.service.guardarSubparcela(s).suscribe(()=>{

      // });
    }
  }

}
