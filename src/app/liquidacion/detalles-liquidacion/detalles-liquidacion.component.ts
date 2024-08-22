import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { LineaLiquidacion } from 'src/app/model/lineaLiquidacion';
import { Liquidacion } from 'src/app/model/liquidacion';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { FincaService } from 'src/app/service/finca.service';
import { LiquidacionService } from 'src/app/service/liquidacion.service';
import { TokenService } from 'src/app/service/token.service';

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
  idUsuarioRegistrado: string | null = "";
  usuarioFinca: UsuarioFinca | null = null;
  rol: string | null = null;
  selectedFinca: string | null = null;
  roles: string[] = [];

  constructor(
    private toastr: ToastrService,
    private fincaService: FincaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private liquidacionService: LiquidacionService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idLiquidacion = params['id'];
      this.loadLiquidacion();
      this.loadLineasLiquidacion();
      this.idUsuarioRegistrado = this.tokenService.getUserId();
      
    });

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      this.getUsuarioFinca();    
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

  getUsuarioFinca() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null && this.selectedFinca != null) {
      this.fincaService.getUsuarioFincaByUsuarioIdAndFincaId(idUsuario, this.selectedFinca).subscribe({
        next: (usuarioFinca) => {
          this.usuarioFinca = usuarioFinca;
          this.rol = this.usuarioFinca != null ? this.usuarioFinca.rol : null;
        },
        error: (error) => {
          if (this.usuarioFinca === null) {
            this.roles = this.tokenService.getAuthorities();
            this.rol = this.roles[0];
          }
        }
      })
    }   
  }
}
