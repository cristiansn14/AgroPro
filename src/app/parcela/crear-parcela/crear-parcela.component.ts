import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subparcela } from 'src/app/model/subparcela';
import { Parcela } from 'src/app/model/parcela'; 
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/service/usuario.service';
import { FincaService } from 'src/app/service/finca.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/model/usuario';
import { ParcelaConstruccion } from 'src/app/model/parcelaConstruccion';
import { StaticDataService } from 'src/app/service/static-data.service';
import { PoligonoParcela } from 'src/app/model/poligonoParcela';
import { Paraje } from 'src/app/model/paraje';
import { Cultivo } from 'src/app/model/cultivo';
import { ParcelaDto } from 'src/app/model/parcelaDto';
import { ParcelaConstruccionDto } from 'src/app/model/parcelaConstruccionDto'
import { ParcelaService } from 'src/app/service/parcela.service';
import { UsuarioParcela } from 'src/app/model/usuario-parcela';
import { Recinto } from 'src/app/model/recinto';

export function uniqueUserValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      const ids = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['usuario'].value)
        .filter(id => id != null);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        return { duplicateUser: true };
      }
    }
    return null;
  };
}

export function participacionSumaValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      const participaciones = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['participacion'].value)
        .filter(value => value !== null && value !== undefined);
      
      const sumaTotal = participaciones.reduce((acc, curr) => acc + curr, 0);
      
      return sumaTotal <= 100 && sumaTotal >= 95 ? null : { participacionTotalInvalida: true };
    }
    return null;
  };
}

export function superficieValidator(parcelaControl: AbstractControl): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray && parcelaControl) {
      const superficies = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['superficie'].value)
        .filter(value => value !== null && value !== undefined);

      const sumaTotal = superficies.reduce((acc, curr) => acc + curr, 0);
      const superficieParcela = parcelaControl.value;

      return sumaTotal === superficieParcela ? null : { superficieInvalida: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-crear-parcela',
  templateUrl: './crear-parcela.component.html',
  styleUrls: ['./crear-parcela.component.scss']
})

export class CrearParcelaComponent implements OnInit, OnDestroy {
  usuariosDisponibles: Usuario[] = [];
  poligonosParcela: PoligonoParcela[] = [];
  parcelasDisponibles: PoligonoParcela[] = [];
  parajes: Paraje[] = [];
  cultivos: Cultivo[] = [];
  poligonos: number[] = [];
  parcelas: string[] = [];
  parcelaForm!: FormGroup;
  parcelaConstruccionForm!: FormGroup;
  propietariosForm!: FormGroup;
  subparcelasForm!: FormGroup;
  recintosForm!: FormGroup;
  propietarioRows: any[][] = [];
  subparcelaRows: any[] = [];
  recintoRows: any[] = [];
  tipoParcela: string = '';
  numeroSubparcelas: number = 0;
  numeroRecintos: number = 0;
  numeroPropietarios: number = 0;
  parcela: Parcela = new Parcela(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  parcelaConstruccion: ParcelaConstruccion = new ParcelaConstruccion(null, null, null, null, null, null, null, null, null, null, null, null);
  private subscription: Subscription | null = null;
  selectedFinca: string | null = null;
  error: string = "";
  selectedPoligono: number | null = null;
  selectedParcela: string | null = null;
  selectedParaje: number | null = null;

  constructor(
    private usuarioService: UsuarioService, 
    private fb: FormBuilder,
    private fincaService: FincaService,
    private toastr: ToastrService,
    private staticDataService: StaticDataService,
    private parcelaService: ParcelaService
  ) {}

  ngOnInit(): void {
    this.tipoParcela = '';
    this.numeroPropietarios = 0;
    this.numeroSubparcelas = 0;
    this.numeroRecintos = 0;

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadUsuariosDisponibles(this.selectedFinca);
        this.loadPoligonosParcela(this.selectedFinca);
        this.loadParajes(this.selectedFinca);
        this.loadCultivos();
      }
      this.initParcelaForm();
      this.initPropietariosForm();
      this.initSubparcelasForm();
      this.initRecintosForm();
    });
  }

  private initParcelaForm() {
    this.parcelaForm = this.fb.group({
      referencia: ['', Validators.required],
      clase: ['', Validators.required],
      usoPrincipal: ['', Validators.required],
      superficie: ['', [Validators.required, Validators.min(1)]],
      valorSuelo: [null],
      valorConstruccion: [null],
      valorCatastral: [null],
      añoValor: [null],
      selectedPoligono: ['', Validators.required],
      selectedParcela: ['', Validators.required],
      selectedParaje: ['', Validators.required],
    });
  }

  private initPropietariosForm() {
    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([], Validators.compose([
        uniqueUserValidator(),
        participacionSumaValidator()
      ]))
    });
    this.addPropietarioForms();
  }

  private addPropietarioForms() {
    const propietariosArray = this.propietariosForm.get('propietarios') as FormArray;
    propietariosArray.clear();
    for (let i = 0; i < this.numeroPropietarios; i++) {
      propietariosArray.push(this.createPropietarioForm());
    }
  }

  private initSubparcelasForm() {
    this.subparcelasForm = this.fb.group({
      subparcelas: this.fb.array([], superficieValidator(this.parcelaForm?.get('superficie')!))
    });
    this.addSubparcelaForms();
  }

  private addSubparcelaForms() {
    const subparcelasArray = this.subparcelasForm.get('subparcelas') as FormArray;
    subparcelasArray.clear();
    for (let i = 0; i < this.numeroSubparcelas; i++) {
      subparcelasArray.push(this.createSubparcelaForm());
    }
  }

  private initRecintosForm() {
    this.recintosForm = this.fb.group({
      recintos: this.fb.array([], superficieValidator(this.parcelaForm?.get('superficie')!))
    });
    this.addRecintoForms();
  }

  private addRecintoForms() {
    const recintosArray = this.recintosForm.get('recintos') as FormArray;
    recintosArray.clear();
    for (let i = 0; i < this.numeroRecintos; i++) {
      recintosArray.push(this.createRecintoForm());
    }
  }

  loadUsuariosDisponibles(idFinca: string) {
    this.usuarioService.findUsuariosInFinca(idFinca).subscribe({
      next: (usuarios) => {
        this.usuariosDisponibles = usuarios;
        this.updatePropietariosValidators();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener usuarios disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadPoligonosParcela(idFinca: string) {
    this.staticDataService.getPoligonoParcelaByFinca(idFinca).subscribe({
      next: (poligonosParcela) => {
        this.poligonosParcela = poligonosParcela;
        this.poligonos = [...new Set(poligonosParcela.map(p => p.poligono).filter(p => p !== null))] as number[];
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener los poligonos parcela disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadParajes(idFinca: string) {
    this.staticDataService.getParajesByFinca(idFinca).subscribe({
      next: (parajes) => {
        this.parajes = parajes;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener los parajes disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadCultivos() {
    this.staticDataService.getCultivos().subscribe({
      next: (cultivos) => {
        this.cultivos = cultivos;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener los cultivos disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  onPoligonoChange() {
    if (this.parcelaForm.get('selectedPoligono')?.value !== null) {
      this.parcelasDisponibles = this.poligonosParcela.filter(p => p.poligono === Number(this.parcelaForm.get('selectedPoligono')?.value));
      this.parcelas = [...new Set(this.parcelasDisponibles.map(p => p.parcela).filter(p => p !== null))] as string[];     
    } else {
      this.parcelasDisponibles = [];
      this.parcelas = [];
    }
  }

  updatePropietariosValidators() {
    const propietarios = this.propietariosForm.get('propietarios') as FormArray;
    propietarios.clearValidators();
    propietarios.setValidators(Validators.compose([
      uniqueUserValidator()
    ]));
    propietarios.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByFn(index: number, item: any): number {
    return index; 
  }

  get propietarios(): FormArray {
    return this.propietariosForm.get('propietarios') as FormArray;
  }

  get subparcelas(): FormArray {
    return this.subparcelasForm.get('subparcelas') as FormArray;
  }

  get recintos(): FormArray {
    return this.recintosForm.get('recintos') as FormArray;
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

  generarFormularioParcela() {
    this.parcelaForm.reset();
    this.subparcelasForm.reset();
    this.recintosForm.reset();
  }

  generarFormularioSubparcela() {
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

  generarFormularioRecinto() {
    const cantidadActual = this.recintos.length;

    if (this.numeroRecintos > cantidadActual) {
      // Agregar nuevos formularios
      for (let i = cantidadActual; i < this.numeroRecintos; i++) {
        this.recintos.push(this.createRecintoForm());
      }
    } else if (this.numeroRecintos < cantidadActual) {
      // Eliminar formularios excedentes
      for (let i = cantidadActual; i > this.numeroRecintos; i--) {
        this.recintos.removeAt(i - 1);
      }
    }

   // Actualizar el array subparcelaRows
   this.recintoRows = [];
   let row = [];
   for (let i = 0; i < this.recintos.length; i++) {
     row.push(this.recintos.controls[i]);
     if (row.length === 3 || i === this.recintos.length - 1) {
       this.recintoRows.push(row);
       row = [];
     }
   }
  }

  createSubparcelaForm(): FormGroup {
    const subparcelaForm = this.fb.group({
      cultivo: ['', Validators.required],
      intensidad: ['', Validators.required],
      superficie: ['', Validators.required],
    });

    return subparcelaForm;
  }

  createRecintoForm(): FormGroup {
    const recintoForm = this.fb.group({
      superficie: ['', Validators.required],
      pendiente: ['', Validators.required],
      altitud: ['', Validators.required],
      cultivo: ['', Validators.required],
      intensidad: ['', Validators.required],  
      porcentajeSubvencion: [''],
      superficieSubvencion: [''],
      coeficienteRegadio: [''],
      incidencias: [''],
      region: ['']
    });

    return recintoForm;
  }

  guardar(): void {
    if (this.tipoParcela === "construccion"){
      if (this.propietariosForm.get('propietarios')?.value.length === 0) {
        this.toastr.error('Debe haber al menos un propietario.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }

      if (this.propietariosForm.get('propietarios')?.hasError('duplicateUser')) {
        this.toastr.error('No se puede añadir el mismo usuario más de una vez.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }

      const usuariosParcelaRequestDto = (this.propietariosForm.get('propietarios') as FormArray).controls.map(control => new UsuarioParcela(
        null,
        control.get('participacion')?.value,
        control.get('usuario')?.value,
        null, 
        null, 
        null,
        null
      ));

      const referenciaHtml = document.getElementById('referenciaC') as HTMLInputElement;
      const usoPrincipalHtml = document.getElementById('usoPrincipalC') as HTMLInputElement;
      const escaleraCHtml = document.getElementById('escaleraC') as HTMLInputElement;
      const plantaHtml = document.getElementById('plantaC') as HTMLInputElement;
      const puertaHtml = document.getElementById('puertaC') as HTMLInputElement;
      const tipoReformaHtml = document.getElementById('tipoReformaC') as HTMLInputElement;
      const fechaReforaHtml = document.getElementById('fechaReformaC') as HTMLInputElement;
      const superficieHtml = document.getElementById('superficieC') as HTMLInputElement;

      const parcelaConstruccion = new ParcelaConstruccion (
        referenciaHtml.value,
        this.selectedFinca,
        Number(superficieHtml.value),
        Number(escaleraCHtml.value),        
        Number(plantaHtml.value),
        Number(puertaHtml.value),
        tipoReformaHtml.value,
        fechaReforaHtml.value,
        usoPrincipalHtml.value,
        null,
        null,
        null
      );

      const parcelaConstruccionDto = new ParcelaConstruccionDto (
        parcelaConstruccion,
        usuariosParcelaRequestDto
      );
        
      this.parcelaService.guardarParcelaConstruccion(parcelaConstruccionDto).subscribe({
        next: response => {
          this.toastr.success('La parcela se ha añadido correctamente.', 'Éxito', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: err => {
          this.toastr.error(err.error.message, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
      });

    } else {
      if (this.propietariosForm.get('propietarios')?.value.length === 0) {
        this.toastr.error('Debe haber al menos un propietario.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
  
      if (this.subparcelasForm.get('subparcelas')?.value.length === 0) {
        this.toastr.error('Debe haber al menos una subparcela.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
  
      if (this.recintosForm.get('recintos')?.value.length === 0) {
        this.toastr.error('Debe haber al menos un recinto.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
  
      if (this.propietariosForm.get('propietarios')?.hasError('duplicateUser')) {
        this.toastr.error('No se puede añadir el mismo usuario más de una vez.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }
  
      if (this.propietariosForm.get('propietarios')?.hasError('participacionTotalInvalida')) {
        this.toastr.error('El porcentaje de participacion total debe estar entre 95 y 100.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }
  
      if (this.subparcelasForm.get('subparcelas')?.hasError('superficieInvalida')) {
        this.toastr.error('La suma de superficies de subparcelas debe ser igual a la superficie de la parcela.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }
  
      if (this.recintosForm.get('recintos')?.hasError('superficieInvalida')) {
        this.toastr.error('La suma de superficies de recintos debe ser igual a la superficie de la parcela.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }
  
      const usuariosParcelaRequestDto = (this.propietariosForm.get('propietarios') as FormArray).controls.map(control => new UsuarioParcela(
        null,
        control.get('participacion')?.value,
        control.get('usuario')?.value,
        null, 
        null, 
        null,
        null
      ));
  
      const poligonoParcela: PoligonoParcela | undefined = this.poligonosParcela.find(p => p.poligono === Number(this.parcelaForm.get('selectedPoligono')?.value) && p.parcela === this.parcelaForm.get('selectedParcela')?.value);
  
      const parcelaRequestDto = new Parcela(
        this.parcelaForm.get('referencia')?.value,
        poligonoParcela?.id ?? null,
        this.parcelaForm.get('selectedParaje')?.value,
        this.selectedFinca,
        this.parcelaForm.get('clase')?.value,
        this.parcelaForm.get('usoPrincipal')?.value,
        this.parcelaForm.get('superficie')?.value,
        this.parcelaForm.get('valorSuelo')?.value,
        this.parcelaForm.get('valorConstruccion')?.value,
        this.parcelaForm.get('valorCatastral')?.value,
        this.parcelaForm.get('añoValor')?.value,
        null,
        null,
        null
      );
  
      const subparcelasRequestDto = (this.subparcelasForm.get('subparcelas') as FormArray).controls.map(control => new Subparcela(
        null,
        null,
        null,
        control.get('intensidad')?.value,
        control.get('superficie')?.value,
        control.get('cultivo')?.value,
        null,
        null,
        null
      ));
  
      const recintosRequestDto = (this.recintosForm.get('recintos') as FormArray).controls.map(control => new Recinto(
        null,
        null,
        null,
        control.get('superficie')?.value,
        control.get('pendiente')?.value,
        control.get('altitud')?.value,
        control.get('cultivo')?.value,
        control.get('porcentajeSubvencion')?.value,
        control.get('superficieSubvencion')?.value,
        control.get('coeficienteRegadio')?.value,
        control.get('incidencias')?.value,
        control.get('region')?.value,
        null,
        null,
        null
      ));
  
      const parcelaDto: ParcelaDto = new ParcelaDto(      
        parcelaRequestDto,
        subparcelasRequestDto,
        recintosRequestDto,
        usuariosParcelaRequestDto
      );
  
      this.parcelaService.guardarParcela(parcelaDto).subscribe({
        next: response => {
          this.toastr.success('La parcela se ha añadido correctamente.', 'Éxito', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: err => {
          this.toastr.error(err.error.message, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
      });
    }
    }
    
}
