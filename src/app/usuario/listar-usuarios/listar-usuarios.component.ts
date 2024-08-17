import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioInfo } from 'src/app/model/usuarioInfo';
import { TokenService } from 'src/app/service/token.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit{

  usuariosActivos: UsuarioInfo[] = [];
  usuariosBaja: UsuarioInfo[] = [];
  error: string = "";
  idUsuarioRegistrado: string | null = "";

  constructor(
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadUsuariosActivos();
    this.loadUsuariosBaja();
    this.idUsuarioRegistrado = this.tokenService.getUserId();
  }

  loadUsuariosActivos() {
    this.usuarioService.findAllUsuariosAlta().subscribe({
      next: (data) => {
        this.usuariosActivos = data;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los usuarios activos', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });  
  }

  loadUsuariosBaja() {
    this.usuarioService.findAllUsuariosBaja().subscribe({
      next: (data) => {
        this.usuariosBaja = data;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los usuarios inactivos', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  darBajaUsuario(usuario: UsuarioInfo){
    if (usuario.id) {
      this.usuarioService.darBajaUsuario(usuario.id).subscribe({
        next: () => {
          this.toastr.success('Usuario dado de baja con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al dar de baja al usuario', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  darAltaUsuario(usuario: UsuarioInfo){
    if (usuario.id) {
      this.usuarioService.darAltaUsuario(usuario.id).subscribe({
        next: () => {
          this.toastr.success('Usuario dado de alta de nuevo con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al dar de alta al usuario', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }
}
