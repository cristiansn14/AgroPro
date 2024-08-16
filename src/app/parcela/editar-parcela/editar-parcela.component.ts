import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { Parcela } from 'src/app/model/parcela';
import { ParcelaConstruccion } from 'src/app/model/parcelaConstruccion';
import { FincaService } from 'src/app/service/finca.service';
import { ParcelaService } from 'src/app/service/parcela.service';

@Component({
  selector: 'app-editar-parcela',
  templateUrl: './editar-parcela.component.html',
  styleUrls: ['./editar-parcela.component.scss']
})
export class EditarParcelaComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  referenciaCatastral: string = "";
  parcela: Parcela | null = null;
  parcelaConstruccion: ParcelaConstruccion | null = null;
  error: string = "";
  selectedFinca: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private parcelaService: ParcelaService,
    private fincaService: FincaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.referenciaCatastral = params['referenciaCatastral'];
      if (this.referenciaCatastral) {
        this.loadParcela();
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

  loadParcela(): void {
    this.parcelaService.findParcelaByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (parcela) => {
        this.parcela = parcela;
      },
      error: (err) => {
        this.parcelaService.findParcelaConstruccionByReferenciaCatastral(this.referenciaCatastral).subscribe({
          next: (parcelaConstruccion) => {
            this.parcelaConstruccion = parcelaConstruccion;
          },
          error: (err) => {
            this.error = err.error.message;
            this.toastr.error(this.error, 'Error al cargar la parcela', {
              timeOut: 3000, positionClass: 'toast-top-center'
            })
          }
        });
      }
    });
  }

  editar(){
    if (this.parcela != null) {
      const parcela = new Parcela (
        this.referenciaCatastral,
        this.parcela.poligono,
        this.parcela.parcela,
        this.parcela.paraje,
        this.selectedFinca,
        this.parcela.clase,
        this.parcela.usoPrincipal,
        this.parcela.superficie,
        this.parcela.valorSuelo,
        this.parcela.valorConstruccion,
        this.parcela.valorCatastral,
        this.parcela.anoValor,
        null,
        null,
        null
      );

      this.parcelaService.editarParcela(parcela).subscribe({
        next: response => {
          if (response.status === 304) {
            this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          } else {
            this.toastr.success('La parcela se ha actualizado correctamente', 'Éxito', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
            this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.referenciaCatastral}`);
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
    } else {
      if (!this.parcelaConstruccion?.escalera ||
        !this.parcelaConstruccion?.planta ||
        !this.parcelaConstruccion?.puerta ||
        !this.parcelaConstruccion?.superficie
      ) {
        this.toastr.warning('Campos obligatorios sin rellenar', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }

      const parcelaConstruccion = new ParcelaConstruccion (
        this.referenciaCatastral,
        this.selectedFinca,
        this.parcelaConstruccion.superficie,
        this.parcelaConstruccion.escalera,        
        this.parcelaConstruccion.planta,
        this.parcelaConstruccion.puerta,
        this.parcelaConstruccion.tipoReforma,
        this.parcelaConstruccion.fechaReforma,
        this.parcelaConstruccion.usoPrincipal,
        null,
        null,
        null
      );

      this.parcelaService.editarParcelaConstruccion(parcelaConstruccion).subscribe({
        next: response => {
          if (response.status === 304) {
            this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          } else {
            this.toastr.success('La parcela se ha actualizado correctamente', 'Éxito', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
            this.router.navigateByUrl(`/dashboard/detalles-parcela/${this.referenciaCatastral}`);
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


