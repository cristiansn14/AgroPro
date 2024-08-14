import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Movimiento } from 'src/app/model/movimiento';
import { FincaService } from 'src/app/service/finca.service';
import { MovimientoService } from 'src/app/service/movimiento.service';

@Component({
  selector: 'app-crear-movimiento',
  templateUrl: './crear-movimiento.component.html',
  styleUrls: ['./crear-movimiento.component.scss']
})
export class CrearMovimientoComponent implements OnInit, OnDestroy {

  selectedFile: File | undefined = undefined;
  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";

  constructor(
    private fincaService: FincaService,
    private movimientoService: MovimientoService,
    private router: Router,
    private toastr: ToastrService,
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

  guardar() {
    const conceptoHtml = document.getElementById('concepto') as HTMLInputElement;
    const importeHtml = document.getElementById('importe') as HTMLInputElement;
    const tipoHtml = document.getElementById('tipo') as HTMLInputElement;

    if (conceptoHtml.value === null || Number(importeHtml.value) === null || tipoHtml.value === null) {
      this.toastr.warning('Rellene todos los campos', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    } else {
      const movimiento = new Movimiento (
        null,
        conceptoHtml.value,
        tipoHtml.value,
        Number(importeHtml.value),
        this.selectedFinca,
        null,
        null,
        null,
        null
      );

      this.movimientoService.guardarMovimiento(movimiento, this.selectedFile).subscribe({
        next: () => {
          this.toastr.success('Movimiento creado con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/listar-movimientos`);
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al crear el movimiento', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }

  }
}
