import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Liquidacion } from 'src/app/model/liquidacion';
import { FincaService } from 'src/app/service/finca.service';
import { LiquidacionService } from 'src/app/service/liquidacion.service';

@Component({
  selector: 'app-generar-liquidacion',
  templateUrl: './generar-liquidacion.component.html',
  styleUrls: ['./generar-liquidacion.component.scss']
})
export class GenerarLiquidacionComponent implements OnInit, OnDestroy{

  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";
  selectedFile: File | undefined = undefined;

  constructor(
    private fincaService: FincaService,
    private router: Router,
    private toastr: ToastrService,
    private liquidacionService: LiquidacionService
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const fileNameElement = document.getElementById('file-name');
      if (fileNameElement) {
        fileNameElement.textContent = file.name;
      }
    }
  }

  generar() {
    const fechaDesdeHtml = document.getElementById('fechaDesde') as HTMLInputElement;
    const fechaHastaHtml = document.getElementById('fechaHasta') as HTMLInputElement;
    const conceptoHtml = document.getElementById('concepto') as HTMLInputElement;
    const tipoHtml = document.getElementById('tipo') as HTMLInputElement;

    if (!fechaDesdeHtml?.value ||
      !fechaHastaHtml?.value ||
      !conceptoHtml?.value ||
      !tipoHtml?.value
    ) {
      this.toastr.warning('Campos obligatorios sin rellenar', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    const fechaDesde = new Date(fechaDesdeHtml.value);
    const fechaHasta = new Date(fechaHastaHtml.value);

    if (fechaDesde > fechaHasta) {
      this.toastr.warning('La fecha desde debe ser anterior a la fecha hasta', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    const liquidacion = new Liquidacion (
      null,
      conceptoHtml.value,
      tipoHtml.value,
      null,
      fechaDesde,
      fechaHasta,
      this.selectedFinca,
      null,
      null,
      null,
      null
    );

    this.liquidacionService.generarLiquidacion(liquidacion, this.selectedFile).subscribe({
      next: () => {
        this.toastr.success('Liquidación creada con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigateByUrl(`/dashboard/listar-liquidaciones`);
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al crear la liquidación', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }
}
