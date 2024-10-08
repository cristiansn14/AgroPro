import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SignupRequest } from 'src/app/model/signup-request';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('password2');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    } else {
      return null;
    }
  };
}

export function passwordLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('password2');

    if (password && confirmPassword && (password.value.length <= 7 || confirmPassword.value.length <= 7)) {
      return { wrongLength: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-crear-usuario', 
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})

export class CrearUsuarioComponent implements OnInit{
  usuariosForm!: FormGroup;
  numeroUsuarios: number = 0;
  usuarioRows: any[][] = [];
  usuariosDisponibles: Usuario[] = [];
  selectedFinca: string | null = null;
  error: string = "";
  selectedUsuario: string | null = null;
  roles: string[] = [];
  rol: string = "";

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuariosForm = this.fb.group({
      usuarios: this.fb.array([])
    });
    this.roles = this.tokenService.getAuthorities();
    this.rol = this.roles[0];
  }

  trackByFn(index: number, item: any): number {
    return index; 
  }

  get usuarios(): FormArray {
    return this.usuariosForm.get('usuarios') as FormArray;
  }

  generarFormularioUsuarios(){
    const cantidadActual = this.usuarios.length;

    if (this.numeroUsuarios > cantidadActual) {
      // Agregar nuevos formularios
      for (let i = cantidadActual; i < this.numeroUsuarios; i++) {
        this.usuarios.push(this.createUsuarioForm());
      }
    } else if (this.numeroUsuarios < cantidadActual) {
      // Eliminar formularios excedentes
      for (let i = cantidadActual; i > this.numeroUsuarios; i--) {
        this.usuarios.removeAt(i - 1);
      }
    }

    // Dividir los formularios en filas de 3
    this.usuarioRows = [];
    for (let i = 0; i < this.usuarios.length; i += 3) {
      this.usuarioRows.push(this.usuarios.controls.slice(i, i + 3));
    }
  } 

  createUsuarioForm(): FormGroup {
    const usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', [Validators.required]],
      apellido2: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      superusuario: [false],
      usuariorol: [false]
    }, {
      validators: [passwordsMatchValidator(), passwordLengthValidator()]
    });

    usuarioForm.get('superusuario')?.valueChanges.subscribe(value => {
      if (value) {
        usuarioForm.get('usuariorol')?.setValue(false, { emitEvent: false });
      }
    });

    usuarioForm.get('usuariorol')?.valueChanges.subscribe(value => {
      if (value) {
        usuarioForm.get('superusuario')?.setValue(false, { emitEvent: false });
      }
    });

    return usuarioForm;
  }

  add() {
    if (this.numeroUsuarios === 0) {
      this.toastr.error('Debe haber al menos un usuario.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }
    if (this.usuariosForm.invalid) {
      let foundMismatch = false;
      let foundWrongLength = false;
      // Buscar en cada grupo de controles de usuario si hay un error de desajuste de contraseñas
      this.usuarios.controls.forEach(control => {
        if (control.errors && control.errors['passwordsMismatch']) {
          foundMismatch = true;
        }
        if (control.errors && control.errors['wrongLength']) {
          foundWrongLength = true;
        }
      });
      if (foundMismatch) {
        this.toastr.error('Las contraseñas no son iguales', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      } 
      if (foundWrongLength) {
        this.toastr.error('La longitud minima para las contraseñas es 7 caracteres', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
      if (this.usuariosForm.invalid) {
        this.toastr.error('Formulario no válido, por favor rellene todos los campos.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
    }

    const signupRequest: SignupRequest[] = this.usuarios.controls.map(control => {
      const rol = control.get('superusuario')?.value ? 'SUPERUSUARIO' : (control.get('usuario')?.value ? 'USUARIO' : null);
      return new SignupRequest(
        control.get('nombre')?.value,
        control.get('apellido1')?.value,
        control.get('apellido2')?.value,
        control.get('username')?.value,
        control.get('email')?.value,
        control.get('password')?.value,
        rol
      );
    });

    this.authService.signup(signupRequest).subscribe({
      next: () => {
        this.toastr.success('Usuarios registrados en la plataforma correctamente', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigateByUrl(`/dashboard/home`);
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al registrar usuarios en la plataforma', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      }
    });
  } 
}
