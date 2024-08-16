import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { LineaLiquidacion } from 'src/app/model/lineaLiquidacion';
import { Liquidacion } from 'src/app/model/liquidacion';
import { FincaService } from 'src/app/service/finca.service';
import { LiquidacionService } from 'src/app/service/liquidacion.service';

@Component({
  selector: 'app-detalles-liquidacion',
  templateUrl: './detalles-liquidacion.component.html',
  styleUrls: ['./detalles-liquidacion.component.scss']
})
export class DetallesLiquidacionComponent implements OnInit, OnDestroy{

  private subscription: Subscription | null = null;
  idLiquidacion: string = "";
  error: string = "";
  lineasLiquidacion: LineaLiquidacion[] = [];
  liquidacion: Liquidacion | null = null;

  constructor(
    private toastr: ToastrService,
    private fincaService: FincaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private liquidacionService: LiquidacionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idLiquidacion = params['id'];
      this.loadLiquidacion();
      this.loadLineasLiquidacion();
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

  loadLiquidacion() {
    this.liquidacionService.findById(this.idLiquidacion).subscribe({
      next: (liquidacion) => {
        this.liquidacion = liquidacion;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar la liquidacion', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadLineasLiquidacion() {
    this.liquidacionService.findLineasLiquidacionByLiquidacionId(this.idLiquidacion).subscribe({
      next: (lineasLiquidacion) => {
        this.lineasLiquidacion = lineasLiquidacion;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los datos del usuario', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  recibido(lineaLiquidacion: LineaLiquidacion) {
    this.liquidacionService.liquidacionRecibida(lineaLiquidacion).subscribe({
      next: () => {
        this.toastr.success('Liquidación recibida', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al marcar la liquidación como recibida', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }
}
