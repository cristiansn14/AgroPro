import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { UsuarioParcelaInfo } from 'src/app/model/usuarioParcelaInfo';
import { FincaService } from 'src/app/service/finca.service';
import { ParcelaService } from 'src/app/service/parcela.service';

@Component({
  selector: 'app-editar-usuario-parcela',
  templateUrl: './editar-usuario-parcela.component.html',
  styleUrls: ['./editar-usuario-parcela.component.scss']
})
export class EditarUsuarioParcelaComponent implements OnInit, OnDestroy{

  private subscription: Subscription | null = null;
  idUsuarioParcela: string = "";
  error: string = "";
  selectedFinca: string | null = null;
  usuarioParcelaInfo: UsuarioParcelaInfo | null = null;
  participacionOriginal: number = 0;
  participacionDisponible: number = 0;
  participacionEditada: number = 0;
  participacion: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private parcelaService: ParcelaService,
    private fincaService: FincaService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuarioParcela = params['id'];
      if (this.idUsuarioParcela) {
        this.loadUsuarioParcela();
      }
    });

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
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

  loadUsuarioParcela() {
    this.parcelaService.findUsuarioParcelaById(this.idUsuarioParcela).subscribe({
      next: (usuarioParcela) => {        
        this.usuarioParcelaInfo = usuarioParcela;
        this.participacionOriginal = this.usuarioParcelaInfo.participacion ? this.usuarioParcelaInfo.participacion : 0;
        this.loadParticipacionesDisponibles();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar el usuario asociado a la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadParticipacionesDisponibles() {
    if (this.usuarioParcelaInfo?.referenciaCatastral) {
      this.parcelaService.getParticipacionesDisponibles(this.usuarioParcelaInfo.referenciaCatastral).subscribe({
        next: (participacionDisponible) => {        
          this.participacionDisponible = participacionDisponible;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener la participacion disponible', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }   
  }

  editar() { 
    if (this.usuarioParcelaInfo?.participacion !== null && this.usuarioParcelaInfo?.participacion !== undefined) {
      if (this.usuarioParcelaInfo?.participacion <= 0 || this.usuarioParcelaInfo?.participacion > 100) {
        this.toastr.warning('La participación no puede ser menor que 0 ni mayor que 100', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }
    }

    if (this.usuarioParcelaInfo?.participacion === this.participacionOriginal) {
      this.toastr.warning('No se detectaron cambios', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    } else {
      if (this.usuarioParcelaInfo?.participacion != null && this.usuarioParcelaInfo.participacion <= this.participacionOriginal) {
        this.participacion = this.usuarioParcelaInfo.participacion;
      }
      if (this.usuarioParcelaInfo?.participacion != null && this.usuarioParcelaInfo.participacion > this.participacionOriginal) {
          if ((this.usuarioParcelaInfo.participacion - this.participacionOriginal) <= this.participacionDisponible) {
            this.participacion = this.usuarioParcelaInfo.participacion;
          } else {
            this.toastr.warning('El número de onzas es superior al disponible', 'Atención', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            return;
          }
      }
      if (this.usuarioParcelaInfo) {
        this.parcelaService.editarUsuarioParcela(this.usuarioParcelaInfo).subscribe({
          next: response => {
            if (response.status === 304) {
              this.toastr.info('No se realizaron cambios en el usuario de la parcela.', 'Información', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
            } else {
              this.toastr.success('El usuario parcela se ha actualizado correctamente', 'Éxito', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
              this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.usuarioParcelaInfo?.referenciaCatastral}`);
            }
          },
          error: err => {
            const errorMessage = err?.error?.message || 'No se han detectado cambios';
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
}
