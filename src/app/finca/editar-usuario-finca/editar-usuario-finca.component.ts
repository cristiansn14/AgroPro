import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { UsuarioFincaInfo } from 'src/app/model/usuarioFincaInfo';
import { FincaService } from 'src/app/service/finca.service';

@Component({
  selector: 'app-editar-usuario-finca',
  templateUrl: './editar-usuario-finca.component.html',
  styleUrls: ['./editar-usuario-finca.component.scss']
})
export class EditarUsuarioFincaComponent implements OnInit, OnDestroy{

  private subscription: Subscription | null = null;
  idUsuarioFinca: string = "";
  error: string = "";
  usuarioFinca: UsuarioFincaInfo | null = null;
  isAdmin: boolean = false;
  isPropietario: boolean = false;
  onzasDisponibles: number = 0;
  selectedFinca: string | null = null;
  onzas: number = 0;
  onzasOriginal: number = 0;
  rolOriginal: string = "";
  success: Boolean = false;

  constructor(
    private toastr: ToastrService,
    private fincaService: FincaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuarioFinca = params['id'];
      this.loadUsuarioFinca();
    });

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      this.getOnzasDisponibles(); 
    });

    this.subscription = this.fincaService.selectedFinca$
    .pipe(skip(1))
    .subscribe(fincaId => {
      this.router.navigateByUrl(`/dashboard/home`);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUsuarioFinca(): void {
    this.fincaService.findUsuarioFincaById(this.idUsuarioFinca).subscribe({
      next: (usuarioFinca) => {        
        this.usuarioFinca = usuarioFinca;
        this.onzasOriginal = this.usuarioFinca.onzas ? this.usuarioFinca.onzas : 0;
        this.rolOriginal = this.usuarioFinca.rol ? this.usuarioFinca.rol : "";
        this.setRolCheckboxes();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar el usuario asociado a la finca', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  setRolCheckboxes(): void {
    if (this.usuarioFinca?.rol === 'ADMINISTRADOR') {
      this.isAdmin = true;
      this.isPropietario = false;
    } else if (this.usuarioFinca?.rol === 'PROPIETARIO') {
      this.isAdmin = false;
      this.isPropietario = true;
    } else {
      this.isAdmin = false;
      this.isPropietario = false;
    }
  }

  updateRol(rol: string): void {
    if (rol === 'ADMINISTRADOR') {
      this.isAdmin = true;
      this.isPropietario = false;
      this.usuarioFinca!.rol = 'ADMINISTRADOR';
    } else if (rol === 'PROPIETARIO') {
      this.isAdmin = false;
      this.isPropietario = true;
      this.usuarioFinca!.rol = 'PROPIETARIO';
    }
  }

  getOnzasDisponibles () {
    if (this.selectedFinca) {
      this.fincaService.getOnzasDisponibles(this.selectedFinca).subscribe({
        next: (onzasDisp) => {
          this.onzasDisponibles = onzasDisp;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener las onzas disponibles', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  editar() {
    if (this.usuarioFinca?.onzas === this.onzasOriginal && this.usuarioFinca?.rol === this.rolOriginal) {
      this.toastr.warning('No se detectaron cambios', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    } else {
      if (this.usuarioFinca?.onzas != null && this.usuarioFinca?.onzas <= this.onzasOriginal) {
        this.onzas = this.usuarioFinca?.onzas;
      }
      if (this.usuarioFinca?.onzas != null && this.usuarioFinca?.onzas > this.onzasOriginal) {
          if ((this.usuarioFinca?.onzas - this.onzasOriginal) <= this.onzasDisponibles) {
            this.onzas = this.usuarioFinca?.onzas;
          } else {
            this.toastr.warning('El número de onzas es superior al disponible', 'Atención', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            return;
          }
      }
      if (this.usuarioFinca?.onzas !== null && this.usuarioFinca?.onzas !== undefined && this.usuarioFinca?.onzas <= 0) {
        this.toastr.warning('El número de onzas no puede ser 0', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }
      const usuarioFinca = new UsuarioFinca (
        this.usuarioFinca?.id ? this.usuarioFinca?.id : null,
        this.onzas,
        this.usuarioFinca?.idUsuario ? this.usuarioFinca?.idUsuario : null,
        this.selectedFinca,
        this.usuarioFinca?.rol ? this.usuarioFinca?.rol : null,
        null,
        null
      );

      this.fincaService.editarUsuarioFinca(usuarioFinca).subscribe({
        next: (response) => {
          if (response.status === 304) {
            this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          } else {
            this.toastr.success('Finca actualizada con éxito', 'Éxito', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            this.router.navigateByUrl(`/dashboard/detalles-finca`);
          }         
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'No se han detectado cambios';;
          this.toastr.warning(errorMessage, 'Error al guardar la parcela', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          return;
        }
      });
      
    }    
  }
}
