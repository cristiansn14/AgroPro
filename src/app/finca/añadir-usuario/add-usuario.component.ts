import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { FincaService } from 'src/app/service/finca.service';
import { UsuarioService } from 'src/app/service/usuario.service';

export function onzasTotalValidator(onzasDisponibles: number): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    // Asegurar que el control es un FormArray
    if (!formArray.value || !(formArray instanceof FormArray)) {
      return null; // o { invalidForm: true } si quieres ser explícito
    }

    const totalOnzas = formArray.value
      .map((formGroup: any) => formGroup.onzas || 0)
      .reduce((acc: number, current: number) => acc + current, 0);

    return totalOnzas <= onzasDisponibles ? null : { onzasExceeded: true };
  };
}

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

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent implements OnInit, OnDestroy {
  propietariosForm!: FormGroup;
  numeroPropietarios: number = 0;
  propietarioRows: any[][] = [];
  usuariosDisponibles: Usuario[] = [];
  selectedFinca: string | null = null;
  error: string = "";
  selectedUsuario: string | null = null;
  onzasDisponibles: number = 0;
  private subscription: Subscription | null = null;

  constructor(
    private usuarioService: UsuarioService, 
    private fb: FormBuilder,
    private fincaService: FincaService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadUsuariosDisponibles(this.selectedFinca);
        this.getOnzasDisponibles(this.selectedFinca);
      }     
      this.initForm();
    });
  }

  private initForm() {
    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([], Validators.compose([
        onzasTotalValidator(this.onzasDisponibles), 
        uniqueUserValidator()
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByFn(index: number, item: any): number {
    return index; 
  } 

  loadUsuariosDisponibles(idFinca: string) {
    this.usuarioService.findUsuariosNotInFinca(idFinca).subscribe({
      next: (usuarios) => {
        this.usuariosDisponibles = usuarios;
        if (this.usuariosDisponibles.length === 0) {
          this.toastr.warning(this.error, 'No hay usuarios disponibles para añadir', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/detalles-finca`);
        }
        this.updateValidators();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener usuarios disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  getOnzasDisponibles (idFinca: string) {
    this.fincaService.getOnzasDisponibles(idFinca).subscribe({
      next: (onzasDisp) => {
        this.onzasDisponibles = onzasDisp;
        if (this.onzasDisponibles  === 0) {
          this.toastr.warning(this.error, 'No hay onzas disponibles', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/home`);
        }
        this.updateValidators();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al obtener las onzas disponibles', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  updateValidators() {
    const propietarios = this.propietariosForm.get('propietarios') as FormArray;
    propietarios.clearValidators();
    propietarios.setValidators(Validators.compose([
      onzasTotalValidator(this.onzasDisponibles),
      uniqueUserValidator()
    ]));
    propietarios.updateValueAndValidity();
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
      onzas: ['', [Validators.required, Validators.min(1)]],
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

  add() {
    if (this.propietariosForm.get('propietarios')?.value.length === 0) {
      this.toastr.error('Debe haber al menos un usuario.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    if (this.propietariosForm.get('propietarios')?.hasError('onzasExceeded')) {
      this.toastr.error('La suma de las onzas excede el total disponible.', 'Error', {
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
  
    if (this.propietariosForm.invalid) {
      this.toastr.error('Formulario no válido, faltan campos o alguno es erróneo', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    const usuariosFinca: UsuarioFinca[] = this.propietarios.controls.map(control => {
      const rol = control.get('administrador')?.value ? 'ADMINISTRADOR' : (control.get('propietario')?.value ? 'PROPIETARIO' : null);
      return new UsuarioFinca(
        null,
        control.get('onzas')?.value,
        control.get('usuario')?.value,
        this.selectedFinca,
        rol,
        null,
        null
      );
    });

    if (this.selectedFinca) {
      this.fincaService.addUsuariosFinca(usuariosFinca).subscribe({
        next: () => {
          this.toastr.success('Usuarios añadidos a la finca correctamente', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/detalles-finca`);
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al añadir usuarios a la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        }
      });
    } else {
      this.toastr.error('No se ha seleccionado una finca', 'Error', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }
  }
}
