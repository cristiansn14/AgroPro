import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Movimiento } from 'src/app/model/movimiento';
import { FincaService } from 'src/app/service/finca.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-listar-movimientos',
  templateUrl: './listar-movimientos.component.html',
  styleUrls: ['./listar-movimientos.component.scss']
})
export class ListarMovimientosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['fecha', 'concepto', 'importe', 'archivo', 'opciones'];
  dataSource = new MatTableDataSource<Movimiento>();
  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";
  usuarioFinca: UsuarioFinca | null = null;
  rol: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fincaService: FincaService,
    private movimientoService: MovimientoService,
    private toastr: ToastrService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.movimientoService.findByFincaId(this.selectedFinca).subscribe({
          next: (movimientos) => {
            this.dataSource.data = movimientos.sort((a, b) => {
              const dateA = a.fecha ? new Date(a.fecha) : new Date(0);
              const dateB = b.fecha ? new Date(b.fecha) : new Date(0);
              return dateB.getTime() - dateA.getTime();
            });
            this.dataSource.paginator = this.paginator;
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

  openDocument(movimiento: Movimiento) {
    if (movimiento.idArchivo) {
      const archivoUrl = this.movimientoService.getArchivoUrl(movimiento.idArchivo);
      window.open(archivoUrl, '_blank');     
    }
  }

  calculateTotal(): { value: number, className: string } {
    const total = this.dataSource.data.reduce((sum, movimiento) => sum + (movimiento.importe ?? 0), 0).toFixed(2);
    const className = parseFloat(total) >= 0 ? 'positive-total' : 'negative-total';
    return { value: parseFloat(total), className };
  }

  eliminarMovimiento(movimiento: Movimiento) {
    if (movimiento.id !== null) {
      this.movimientoService.eliminarMovimiento(movimiento.id).subscribe({
        next: () => {
          this.toastr.success('Movimiento eliminado con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al eliminar el movimiento', {
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
          this.error = error.error.message;
          this.toastr.error(this.error, 'No se ha encontrado al usuario para la finca seleccionada', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      })
    }   
  }
}
