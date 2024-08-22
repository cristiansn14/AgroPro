import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Liquidacion } from 'src/app/model/liquidacion';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { FincaService } from 'src/app/service/finca.service';
import { LiquidacionService } from 'src/app/service/liquidacion.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-listar-liquidaciones',
  templateUrl: './listar-liquidaciones.component.html',
  styleUrls: ['./listar-liquidaciones.component.scss']
})
export class ListarLiquidacionesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['fecha', 'concepto', 'tipo', 'importe', 'fechaDesde', 'fechaHasta', 'archivo', 'opciones'];
  dataSource = new MatTableDataSource<Liquidacion>();
  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";
  usuarioFinca: UsuarioFinca | null = null;
  rol: string | null = null;
  roles: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fincaService: FincaService,
    private liquidacionService: LiquidacionService,
    private toastr: ToastrService,
    private movimientoService: MovimientoService,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.liquidacionService.findByFincaId(this.selectedFinca).subscribe({
          next: (liquidaciones) => {
            this.dataSource.data = liquidaciones;
            this.dataSource.paginator = this.paginator;
            if (this.dataSource.data.length === 0) {
              this.toastr.warning(this.error, 'No hay liquidaciones generadas', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
              this.router.navigateByUrl(`/dashboard/home`);
            }
            this.getUsuarioFinca();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDocument(liquidacion: Liquidacion) {
    if (liquidacion.idArchivo) {
      const archivoUrl = this.movimientoService.getArchivoUrl(liquidacion.idArchivo);
      window.open(archivoUrl, '_blank');     
    }
  }

  eliminarLiquidacion(liquidacion: Liquidacion) {
    if (liquidacion.id !== null) {
      this.liquidacionService.eliminarLiquidacion(liquidacion.id).subscribe({
        next: () => {
          this.toastr.success('Liquidación eliminada con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al eliminar la liquidación', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  getUsuarioFinca() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null && this.selectedFinca != null) {
      this.fincaService.getUsuarioFincaByUsuarioIdAndFincaId(idUsuario, this.selectedFinca).subscribe({
        next: (usuarioFinca) => {
          this.usuarioFinca = usuarioFinca;
          this.rol = this.usuarioFinca != null ? this.usuarioFinca.rol != null ? this.usuarioFinca.rol : null : null;
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
