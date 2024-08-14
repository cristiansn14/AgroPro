import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Representante } from 'src/app/model/representante';
import { Usuario } from 'src/app/model/usuario';
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

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
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
