import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FincaInfo } from 'src/app/model/fincaInfo';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { FincaService } from 'src/app/service/finca.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-listar-fincas',
  templateUrl: './listar-fincas.component.html',
  styleUrls: ['./listar-fincas.component.scss']
})
export class ListarFincasComponent {

  fincasActivas: FincaInfo[] = [];
  fincasBaja: FincaInfo[] = [];
  error: string = "";
  idUsuario: string | null = "";
  usuarioFinca: UsuarioFinca | null = null;
  roles: string[] = [];
  rol: string | null = null;

  constructor(
    private toastr: ToastrService,
    private fincaService: FincaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.tokenService.getUserId();
    this.roles = this.tokenService.getAuthorities();
    this.rol = this.roles[0];
    if (this.idUsuario) {
      this.loadFincasActivas();
      this.loadFincasBaja();
    } 
  }

  loadFincasActivas() {
    if (this.idUsuario) {
      this.fincaService.findAllFincasAltaByUsuarioId(this.idUsuario).subscribe({
        next: (data) => {
          this.fincasActivas = data;
          
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al cargar las fincas activas', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      }); 
    }     
  }

  loadFincasBaja() {
    if (this.idUsuario) {
      this.fincaService.findAllFincasBajaByUsuarioId(this.idUsuario).subscribe({
        next: (data) => {
          this.fincasBaja = data;
          console.log(this.fincasBaja.length)
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al cargar las fincas inactivas', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  darBajaFinca(finca: FincaInfo){
    if (finca.id) {
      this.fincaService.darBajaFinca(finca.id).subscribe({
        next: () => {
          this.toastr.success('Finca dada de baja con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al dar de baja a la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  darAltaFinca(finca: FincaInfo){
    if (finca.id) {
      this.fincaService.darAltaFinca(finca.id).subscribe({
        next: () => {
          this.toastr.success('Finca dada de alta de nuevo con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al dar de alta a la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  eliminarFinca(finca: FincaInfo){
    if (finca.id) {
      this.fincaService.eliminarFinca(finca.id).subscribe({
        next: () => {
          this.toastr.success('Finca eliminada con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al eliminar la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }
}
