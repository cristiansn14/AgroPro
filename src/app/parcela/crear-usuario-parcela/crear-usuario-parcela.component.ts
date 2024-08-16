import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioParcela } from 'src/app/model/usuario-parcela';
import { FincaService } from 'src/app/service/finca.service';
import { ParcelaService } from 'src/app/service/parcela.service';
import { UsuarioService } from 'src/app/service/usuario.service';

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

export function participacionSumaValidator(participacionDisponible: number): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      const participaciones = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['participacion'].value)
        .filter(value => value !== null && value !== undefined);
      
      const sumaTotal = participaciones.reduce((acc, curr) => acc + curr, 0);
      
      return sumaTotal <= participacionDisponible ? null : { participacionTotalInvalida: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-crear-usuario-parcela',
  templateUrl: './crear-usuario-parcela.component.html',
  styleUrls: ['./crear-usuario-parcela.component.scss']
})



export class CrearUsuarioParcelaComponent implements OnInit, OnDestroy {

  usuariosDisponibles: Usuario[] = [];
  propietariosForm!: FormGroup;
  propietarioRows: any[][] = [];
  numeroPropietarios: number = 0;
  private subscription: Subscription | null = null;
  selectedFinca: string | null = null;
  error: string = "";
  referenciaCatastral: string = "";
  participacionDisponible: number = 0;
  participacion: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService, 
    private fb: FormBuilder,
    private fincaService: FincaService,
    private toastr: ToastrService,
    private parcelaService: ParcelaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.numeroPropietarios = 0;

    this.activatedRoute.params.subscribe(params => {
      this.referenciaCatastral = params['referenciaCatastral'];
    });

    this.loadParticipacionesDisponibles();

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadUsuariosDisponibles();
      }
      this.initPropietariosForm();
    }); 

    this.subscription = this.fincaService.selectedFinca$
    .pipe(skip(1))
    .subscribe(fincaId => {
      this.router.navigateByUrl(`/dashboard/home`);
    });
  }

  loadUsuariosDisponibles() {
    if (this.selectedFinca) {
      this.usuarioService.findUsuariosByFincaAndNotInParcela(this.selectedFinca, this.referenciaCatastral).subscribe({
        next: (usuarios) => {
          this.usuariosDisponibles = usuarios;
          if (this.usuariosDisponibles.length === 0) {
            this.toastr.warning(this.error, 'No hay usuarios disponibles para añadir', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.referenciaCatastral}`);
          }
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
  }

  loadParticipacionesDisponibles() {
    this.parcelaService.getParticipacionesDisponibles(this.referenciaCatastral).subscribe({
      next: (participacionDisponible) => {        
        this.participacionDisponible = participacionDisponible;
        if (this.participacionDisponible === 0) {
          this.toastr.warning(this.error, 'No hay participaciones disponibles', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.referenciaCatastral}`);
        }
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener la participacion disponible', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    }); 
  }

  updatePropietariosValidators() {
    const propietarios = this.propietariosForm.get('propietarios') as FormArray;
    propietarios.clearValidators();
    propietarios.setValidators(Validators.compose([
      uniqueUserValidator(),
      participacionSumaValidator(this.participacionDisponible)
    ]));
    propietarios.updateValueAndValidity();
  }

  private initPropietariosForm() {
    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([], Validators.compose([
        uniqueUserValidator(),
        participacionSumaValidator(this.participacionDisponible)
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
      participacion: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    return propietarioForm;
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

  guardar() {
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

    if (this.propietariosForm.get('propietarios')?.hasError('participacionTotalInvalida')) {
      this.toastr.error('La participación total no pueden superar las disponibles.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return; 
    }

    if (this.propietariosForm.invalid) {
      this.toastr.error('Formulario no válido, faltan campos o alguno es erróneo', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    const usuariosParcelaRequestDto = (this.propietariosForm.get('propietarios') as FormArray).controls.map(control => new UsuarioParcela(
      null,
      control.get('participacion')?.value,
      control.get('usuario')?.value,
      this.referenciaCatastral, 
      this.referenciaCatastral, 
      null,
      null
    ));

    this.parcelaService.crearUsuarioParcela(usuariosParcelaRequestDto).subscribe({
      next: () => {
        this.toastr.success('Usuarios añadidos a la finca correctamente', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.referenciaCatastral}`);
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al añadir usuarios a la finca', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      }
    });
  }
}
