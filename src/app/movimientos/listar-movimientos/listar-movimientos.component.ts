import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Movimiento } from 'src/app/model/movimiento';
import { FincaService } from 'src/app/service/finca.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-movimientos',
  templateUrl: './listar-movimientos.component.html',
  styleUrls: ['./listar-movimientos.component.scss']
})
export class ListarMovimientosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['fecha', 'concepto', 'importe', 'archivo'];
  dataSource = new MatTableDataSource<Movimiento>();
  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fincaService: FincaService,
    private movimientoService: MovimientoService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.movimientoService.findByFincaId(this.selectedFinca).subscribe({
          next: (movimientos) => {
            this.dataSource.data = movimientos;
            this.dataSource.paginator = this.paginator;
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
    const total = this.dataSource.data.reduce((sum, movimiento) => sum + (movimiento.importe ?? 0), 0);
    const className = total >= 0 ? 'positive-total' : 'negative-total';
    return { value: total, className };
  }
}
