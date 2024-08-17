import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Comunidad } from 'src/app/model/comunidad';
import { Finca } from 'src/app/model/finca';
import { Municipio } from 'src/app/model/municipio';
import { Provincia } from 'src/app/model/provincia';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { UsuarioFincaInfo } from 'src/app/model/usuarioFincaInfo';
import { FincaService } from 'src/app/service/finca.service';
import { ParcelaService } from 'src/app/service/parcela.service';
import { StaticDataService } from 'src/app/service/static-data.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-detalles-finca',
  templateUrl: './detalles-finca.component.html',
  styleUrls: ['./detalles-finca.component.scss']
})
export class DetallesFincaComponent implements OnInit, OnDestroy{

  finca: Finca | null = null;
  usuariosFincaInfo: UsuarioFincaInfo[] = [];
  selectedFinca: string | null = null;
  error: string = "";
  comunidad: Comunidad | null = null;
  provincia: Provincia | null = null;
  municipio: Municipio | null = null;
  parcelas: string[] = [""];
  parcelasBaja: string[] = [""];
  private subscription: Subscription | null = null;

  constructor(
    private toastr: ToastrService,
    private fincaService: FincaService,
    private staticDataService: StaticDataService,
    private parcelaService: ParcelaService
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadFinca();
        this.loadParcelas();
        this.loadParcelasBaja();
        this.loadUsuarios();
      }     
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadFinca(): void {
    if (this.selectedFinca) {
      this.fincaService.findById(this.selectedFinca).subscribe({
        next: (fincaDto) => {
          this.finca = fincaDto;
          this.loadComunidad();  
          this.loadProvincia();       
          this.loadMunicipio();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener los datos de la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }   
  }

  loadParcelas(): void {
    if (this.selectedFinca) {
      this.fincaService.getParcelasByIdFinca(this.selectedFinca).subscribe({
        next: (parcelas) => {
          this.parcelas = parcelas;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener las parcelas de la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  loadParcelasBaja(): void {
    if (this.selectedFinca) {
      this.fincaService.getParcelasBajaByIdFinca(this.selectedFinca).subscribe({
        next: (parcelas) => {
          this.parcelasBaja = parcelas;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener las parcelas de baja de la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  loadComunidad(): void {
    if (this.finca){
      this.staticDataService.getNombreComunidadById(this.finca?.comunidad).subscribe({
        next: (nombreComunidad) => {
          this.comunidad = nombreComunidad;          
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener la comunidad', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  loadProvincia(): void {
    if (this.finca){
      this.staticDataService.getNombreProvinciaById(this.finca?.provincia).subscribe({
        next: (nombreProvincia) => {
          this.provincia = nombreProvincia;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener la provincia', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  loadMunicipio(): void {
    if (this.finca){
      this.staticDataService.getNombreMunicipioById(this.finca?.municipio).subscribe({
        next: (nombreMunicipio) => {
          this.municipio = nombreMunicipio;          
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener el municipio', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }    
  }

  loadUsuarios() {
    if (this.selectedFinca) {
      this.fincaService.findUsuariosFincaByFincaId(this.selectedFinca).subscribe({
        next: (usuariosFinca) => {
          this.usuariosFincaInfo = usuariosFinca;
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener los usuarios', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }   
  }

  eliminarUsuarioFinca(usuarioFincaInfo: UsuarioFincaInfo) {
    const usuarioFinca = new UsuarioFinca (
      usuarioFincaInfo?.id ? usuarioFincaInfo?.id : null,
      null,
      null,
      null,
      null,
      null,
      null
    );

    this.fincaService.eliminarUsuarioFinca(usuarioFinca).subscribe({
      next: () => {
        this.toastr.success('Usuario de la finca eliminado con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al eliminar el usuario finca', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  darAltaParcela(parcela: string) {
    this.parcelaService.darAltaParcela(parcela).subscribe({
      next: () => {
        this.toastr.success('Parcela añadida de nuevo con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al añadir de nuevo la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  darBajaParcela(parcela: string) {
    this.parcelaService.darBajaParcela(parcela).subscribe({
      next: () => {
        this.toastr.success('Parcela eliminada con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al eliminar la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }
}
