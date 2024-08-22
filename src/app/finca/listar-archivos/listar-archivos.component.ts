import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Archivo } from 'src/app/model/archivo';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FincaService } from 'src/app/service/finca.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-listar-archivos',
  templateUrl: './listar-archivos.component.html',
  styleUrls: ['./listar-archivos.component.scss']
})
export class ListarArchivosComponent implements OnInit, OnDestroy{

  displayedColumns: string[] = ['archivo'];
  dataSource = new MatTableDataSource<Archivo>();
  selectedFinca: string | null = null;
  private subscription: Subscription | null = null;
  error: string = "";
  selectedFile: File | undefined = undefined;
  usuarioFinca: UsuarioFinca | null = null;
  rol: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fincaService: FincaService,
    private toastr: ToastrService,
    private router: Router,
    private movimientoService: MovimientoService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.fincaService.findArchivosByIdFinca(this.selectedFinca).subscribe({
          next: (archivos) => {
            this.dataSource.data = archivos;
            this.dataSource.paginator = this.paginator;
            this.getUsuarioFinca();
            if (this.dataSource.data.length === 0) {
              this.toastr.warning(this.error, 'No hay archivos en la finca', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
            }
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

  openDocument(archivo: Archivo) {
    if (archivo.id) {
      const archivoUrl = this.movimientoService.getArchivoUrl(archivo.id);
      window.open(archivoUrl, '_blank');     
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.selectedFinca) {
      this.selectedFile = file;
      this.guardarArchivo();
    }
  }

  guardarArchivo () {
    if (this.selectedFinca && this.selectedFile) {
      this.fincaService.guardarArchivo(this.selectedFinca, this.selectedFile).subscribe({
        next: () => {
          this.toastr.success('Archivo guardado con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.ngOnInit();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al guardar el archivo', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  eliminarArchivo(archivo: Archivo) {
    if (archivo.id !== null) {
      this.fincaService.eliminarArchivo(archivo.id).subscribe({
        next: () => {
          this.toastr.success('Archivo eliminado con éxito', 'Éxito', {
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
          if ((this.rol === 'SUPERUSUARIO' || this.rol === 'ADMINISTRADOR') && !this.displayedColumns.includes('opciones')) {
            this.displayedColumns.push('opciones');
          }
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
