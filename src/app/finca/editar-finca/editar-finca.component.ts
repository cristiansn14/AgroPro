import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, of, Subscription, switchMap } from 'rxjs';
import { Comunidad } from 'src/app/model/comunidad';
import { Finca } from 'src/app/model/finca';
import { Municipio } from 'src/app/model/municipio';
import { Provincia } from 'src/app/model/provincia';
import { FincaService } from 'src/app/service/finca.service';
import { StaticDataService } from 'src/app/service/static-data.service';

@Component({
  selector: 'app-editar-finca',
  templateUrl: './editar-finca.component.html',
  styleUrls: ['./editar-finca.component.scss']
})
export class EditarFincaComponent implements OnInit, OnDestroy {

  finca: Finca | null = null;
  fincaOriginal: Finca | null = null;
  comunidades: Comunidad[] = [];
  provincias:  Provincia[] = [];
  municipios: Municipio[] = [];
  selectedMunicipio: number | null = null;
  selectedProvincia: number | null = null;
  selectedComunidad: number | null = null;
  private subscription: Subscription | null = null;
  selectedFinca: string | null = null;
  error: string = "";
  
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fincaService: FincaService,
    private dataService: StaticDataService
  ) {}

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadFinca();
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
      this.fincaService.findById(this.selectedFinca).pipe(
        switchMap((finca) => {
          this.finca = finca;
          this.fincaOriginal = JSON.parse(JSON.stringify(finca));
          return forkJoin({
            comunidades: this.dataService.getComunidades(),
            provincias: this.dataService.getProvincias()
          })
        }),
        catchError((err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al cargar los datos de la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          return of(null);
        })
      ).subscribe(result => {
        if (result) {
          this.comunidades = result.comunidades;
          this.provincias = result.provincias;
          this.setInitialSelections();
        }
      }); 
    } 
  }

  setInitialSelections() {
    if (this.finca?.comunidad) {
      const foundComunidad = this.comunidades.find(c => c.id === this.finca?.comunidad);
      if (foundComunidad) {
        this.selectedComunidad = foundComunidad.id;
      }
    }
    if (this.finca?.provincia) {
      const foundProvincia = this.provincias.find(p => p.id === this.finca?.provincia);
      if (foundProvincia) {
        this.selectedProvincia = foundProvincia.id;
      }
    }
    if (this.finca?.municipio) {
      const foundProvincia = this.provincias.find(p => p.id === this.finca?.provincia);
      if (foundProvincia) {
        this.dataService.getMunicipiosByProvincia(foundProvincia.id).subscribe(data => {
          this.municipios = data;
          if (this.municipios) {
            const foundMunicipio = this.municipios.find(m => m.id === this.finca?.municipio);
            if (foundMunicipio) {
              this.selectedMunicipio = foundMunicipio.id;
            }
          }
        });
      }              
    }
  }

  onComunidadChange() {
    if (this.selectedComunidad != null) {
      this.dataService.getProvinciasByComunidad(this.selectedComunidad).subscribe({
        next: (data) => {        
          this.municipios = [];
          this.provincias = data;
          this.selectedProvincia = null;
          if (this.provincias.length === 1) {
            this.selectedProvincia = this.provincias[0].id;
            this.onProvinciaChange();
          } else {
            this.selectedProvincia = null;
          }
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error cargando provincias', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }  
  }

  onProvinciaChange() {
    if (this.selectedProvincia != null) {
      const selectedProv = this.provincias.find(p => p.id === Number(this.selectedProvincia));
      if (selectedProv && selectedProv.idComunidad) {
          this.selectedComunidad = selectedProv.idComunidad;
          this.dataService.getProvinciasByComunidad(this.selectedComunidad).subscribe({
            next: (data) => {
              this.provincias = data;
              this.selectedProvincia = selectedProv.id;
              this.municipios = [];
              this.selectedMunicipio = null;
            },
            error: (err) => {
              this.error = err.error.message;
              this.toastr.error(this.error, 'Error cargando provincias', {
                timeOut: 3000, positionClass: 'toast-top-center'
              })
            }
          });
      }
      this.dataService.getMunicipiosByProvincia(this.selectedProvincia).subscribe({
        next: (data) => {        
          this.municipios = data;
          if (this.municipios.length === 1) {
            this.selectedMunicipio = this.municipios[0].id;
          }
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error cargando municipios', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    } else {
      this.municipios = [];
      this.selectedMunicipio = null;
      this.selectedComunidad = null;
    }
    
  }

  editar() {
    if (this.finca?.onzas !== null && this.finca?.onzas !== undefined && this.finca?.onzas <= 0) {
      this.toastr.warning('El número de onzas no puede ser 0', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    if (this.finca?.nombre !== null && this.finca?.onzas !== null && this.finca?.comunidad !== null && this.finca?.provincia !== null && this.finca?.municipio !== null) {
      if (this.finca && this.fincaOriginal) {   
        if (this.hayCambios()) {
          this.fincaService.editarFinca(this.finca).subscribe({
            next: (response) => {
              if (response.status === 304) {
                this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
                  timeOut: 3000,
                  positionClass: 'toast-top-center'
                });
              } else {
                this.toastr.success('Finca actualizada con éxito', 'Éxito', {
                  timeOut: 3000, positionClass: 'toast-top-center'
                });
                this.router.navigateByUrl(`/dashboard/detalles-finca`);
              }
            },
            error: (err) => {
              const errorMessage = err?.error?.message || 'No se han detectado cambios';;
              this.toastr.warning(errorMessage, 'Error al guardar la parcela', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
            }
          });
        } else {
          this.toastr.warning('No se detectaron cambios', 'Atención', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        }      
      } else {
        this.toastr.warning('No hay fincas', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      }
    }
    else {
      this.toastr.warning('Algunos campos no están rellenos, por favor completelos para realizar la edición', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }   
  }

  hayCambios(): boolean {
    if (this.finca && this.fincaOriginal) {
      // Obtener el ID actual basado en el nombre almacenado en usuarioOriginal
      const comunidadIdOriginal = this.comunidades.find(c => c.id === this.fincaOriginal?.comunidad)?.id;
      const provinciaIdOriginal = this.provincias.find(p => p.id === this.fincaOriginal?.provincia)?.id;
      const municipioIdOriginal = this.municipios.find(m => m.id === this.fincaOriginal?.municipio)?.id;

      // Comprobaciones de cambio
      const comunidadCambiada = this.selectedComunidad && this.selectedComunidad !== comunidadIdOriginal;
      const provinciaCambiada = this.selectedProvincia && this.selectedProvincia !== provinciaIdOriginal;
      const municipioCambiado = this.selectedMunicipio && Number(this.selectedMunicipio) !== municipioIdOriginal;

      if (comunidadCambiada || provinciaCambiada || municipioCambiado) {
        if (comunidadCambiada && this.selectedComunidad) {
          this.finca.comunidad = this.selectedComunidad;
        }
        if (provinciaCambiada && this.selectedProvincia) {
          this.finca.provincia = this.selectedProvincia;
        } 
        if (municipioCambiado && this.selectedMunicipio) {
          this.finca.municipio = this.selectedMunicipio; 
        } 
      }

      if (comunidadCambiada == false && comunidadIdOriginal) {
        this.finca.comunidad = comunidadIdOriginal;
      }
      if (provinciaCambiada == false && provinciaIdOriginal) {
        this.finca.provincia = provinciaIdOriginal;
      }
      if (municipioCambiado == false && municipioIdOriginal) {
        this.finca.municipio = municipioIdOriginal;
      }

      return this.fincaOriginal.nombre !== this.finca.nombre ||
      this.fincaOriginal.onzas !== this.finca.onzas ||
      !!comunidadCambiada || 
      !!provinciaCambiada || 
      !!municipioCambiado
    }

    return false;
  }
}
