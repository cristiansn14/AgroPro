import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Representante } from 'src/app/model/representante';
import { Usuario } from 'src/app/model/usuario';
import { TokenService } from 'src/app/service/token.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './detalles-usuario.component.html',
  styleUrls: ['./detalles-usuario.component.scss']
})
export class DetallesUsuarioComponent implements OnInit{

  usuario: Usuario | null = null;
  idUsuario: string = "";
  error: string = "";
  representantes: Representante[] = [];
  representantesAlta: Representante[] = [];
  representantesBaja: Representante[] = [];
  fotoPerfilUrl: string | null = null;
  flagFoto: boolean = false;

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
      if (this.idUsuario) {
        this.loadUsuario();
        this.loadRepresentantes();
      }
    });
  }

  loadUsuario(): void {
    this.usuarioService.findById(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        this.getFotoPerfil();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los datos del usuario', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });  
  }

  loadRepresentantes(): void {
    this.usuarioService.findRepresentantesByIdUsuario(this.idUsuario).subscribe({
      next: (data) => {
        this.representantes = data;
        this.representantesAlta = this.representantes.filter(r => r.fechaBaja === null);
        this.representantesBaja = this.representantes.filter(r => r.fechaBaja !== null);
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los representantes del usuario', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });  
  }

  getFotoPerfil() {
    const idUsuarioRegistrado = this.tokenService.getUserId();
    const idUsuarioPerfil = this.usuario?.id;

    if (idUsuarioPerfil) {
      if (idUsuarioRegistrado != idUsuarioPerfil) {
        this.usuarioService.getFotoPerfil(idUsuarioPerfil).subscribe({
          next: (foto) => {
            const reader = new FileReader();
            reader.readAsDataURL(foto); 
            reader.onloadend = () => {
              this.fotoPerfilUrl = reader.result as string;
              this.flagFoto = true;
            }
          },
          error: (error) => {
            this.error = error.error.message;
            this.toastr.error(this.error, 'No se pudo cargar la foto de perfil', {
              timeOut: 3000, positionClass: 'toast-top-center'
            })
          }
        })
      }
    }  
  }

  eliminarRepresentante(representante: Representante) {
    if (representante) {
      this.usuarioService.eliminarRepresentante(representante).subscribe({
        next: (data) => {        
          this.toastr.success('Representante eliminado correctamente', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al eliminar el representante', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      })
    }
    
  }
}
