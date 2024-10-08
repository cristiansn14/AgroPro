import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';
import { StaticDataService } from 'src/app/service/static-data.service';
import { Comunidad } from 'src/app/model/comunidad';
import { Provincia } from 'src/app/model/provincia';
import { Municipio } from 'src/app/model/municipio';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  @Output() profileUpdated: EventEmitter<string> = new EventEmitter<string>();

  usuario: Usuario | null = null;
  usuarioOriginal: Usuario | null = null; 
  idUsuario: string = "";
  error: string = "";
  comunidades: Comunidad[] = [];
  provincias:  Provincia[] = [];
  municipios: Municipio[] = [];
  selectedMunicipio: number | null = null;
  selectedProvincia: number | null = null;
  selectedComunidad: number | null = null;
  selectedFile: File | undefined = undefined;

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private dataService: StaticDataService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
      if (this.idUsuario) {
          this.usuarioService.findById(this.idUsuario).pipe(
            switchMap((usuario) => {
              this.usuario = usuario;
              this.usuarioOriginal = JSON.parse(JSON.stringify(usuario));
              // Carga comunidades y provincias en paralelo
              return forkJoin({
                comunidades: this.dataService.getComunidades(),
                provincias: this.dataService.getProvincias()
              });
            }),
            catchError((err) => {
              this.error = err.error.message;
              this.toastr.error(this.error, 'Error al cargar los datos del usuario', {
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
    });
  }

  setInitialSelections() {
    if (this.usuario?.comunidad) {
      const foundComunidad = this.comunidades.find(c => c.nombre === this.usuario?.comunidad);
      if (foundComunidad) {
        this.selectedComunidad = foundComunidad.id;
      }
    }
    if (this.usuario?.provincia) {
      const foundProvincia = this.provincias.find(p => p.nombre === this.usuario?.provincia);
      if (foundProvincia) {
        this.selectedProvincia = foundProvincia.id;
      }
    }
    if (this.usuario?.municipio) {
      const foundProvincia = this.provincias.find(p => p.nombre === this.usuario?.provincia);
      if (foundProvincia) {
        this.dataService.getMunicipiosByProvincia(foundProvincia.id).subscribe(data => {
          this.municipios = data;
          if (this.municipios) {
            const foundMunicipio = this.municipios.find(m => m.nombre === this.usuario?.municipio);
            if (foundMunicipio) {
              this.selectedMunicipio = foundMunicipio.id;
            }
          }
        });
      }              
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
    if (this.usuario && this.usuarioOriginal) {
      if (this.usuario.nombre?.length === 0 ||
          this.usuario.apellido1?.length === 0 ||
          this.usuario.apellido2?.length === 0 ||
          this.usuario.email?.length === 0 ||
          this.usuario.username?.length === 0
      ) {
        this.toastr.warning('Campos obligatorios sin rellenar', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }  
      if (this.hayCambios() || this.selectedFile) {
        this.usuarioService.editarUsuario(this.usuario, this.selectedFile).subscribe({
          next: (response) => {
            if (this.selectedFile) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64String = reader.result as string;
                this.usuarioService.updateProfilePicture(base64String);
              };
              reader.readAsDataURL(this.selectedFile);
            }
            if (response.status === 304) {
              this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
            } else {
              this.toastr.success('Usuario actualizado con éxito', 'Éxito', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
              this.router.navigateByUrl(`/dashboard/ver-perfil/${this.idUsuario}`);
            }         
          },
          error: (err) => {
            const errorMessage = err?.error?.message || 'No se han detectado cambios';
            this.toastr.warning(errorMessage, 'Error al guardar la parcela', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
            return;
          }
        });
      } else {
        this.toastr.warning('No se detectaron cambios', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      }      
    } else {
      this.toastr.warning('No hay usuarios', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }
  }

  hayCambios(): boolean {
    if (this.usuario && this.usuarioOriginal) {
      // Obtener el ID actual basado en el nombre almacenado en usuarioOriginal
      const comunidadIdOriginal = this.comunidades.find(c => c.nombre === this.usuarioOriginal?.comunidad)?.id;
      const provinciaIdOriginal = this.provincias.find(p => p.nombre === this.usuarioOriginal?.provincia)?.id;
      const municipioIdOriginal = this.municipios.find(m => m.nombre === this.usuarioOriginal?.municipio)?.id;

      // Comprobaciones de cambio
      const comunidadCambiada = this.selectedComunidad && this.selectedComunidad !== comunidadIdOriginal;
      const provinciaCambiada = this.selectedProvincia && this.selectedProvincia !== provinciaIdOriginal;
      const municipioCambiado = this.selectedMunicipio && Number(this.selectedMunicipio) !== municipioIdOriginal;

      if (comunidadCambiada || provinciaCambiada || municipioCambiado) {
        if (comunidadCambiada && this.selectedComunidad) {
          this.usuario.comunidad = this.selectedComunidad.toString();
        }
        if (provinciaCambiada && this.selectedProvincia) {
          this.usuario.provincia = this.selectedProvincia.toString();
        } 
        if (municipioCambiado && this.selectedMunicipio) {
          this.usuario.municipio = this.selectedMunicipio.toString(); 
        } 
      }

      if (comunidadCambiada == false && comunidadIdOriginal) {
        this.usuario.comunidad = comunidadIdOriginal.toString();
      }
      if (provinciaCambiada == false && provinciaIdOriginal) {
        this.usuario.provincia = provinciaIdOriginal.toString();
      }
      if (municipioCambiado == false && municipioIdOriginal) {
        this.usuario.municipio = municipioIdOriginal.toString();
      }

      return this.usuarioOriginal.nombre !== this.usuario.nombre ||
      this.usuarioOriginal.apellido1 !== this.usuario.apellido1 ||
      this.usuarioOriginal.apellido2 !== this.usuario.apellido2 ||
      this.usuarioOriginal.username !== this.usuario.username ||
      this.usuarioOriginal.email !== this.usuario.email ||
      this.usuarioOriginal.dni !== this.usuario.dni ||
      comunidadCambiada || 
      provinciaCambiada || 
      municipioCambiado ||
      this.usuarioOriginal.telefono !== this.usuario.telefono ||
      this.usuarioOriginal.direccion !== this.usuario.direccion ||
      this.usuarioOriginal.cuenta !== this.usuario.cuenta ||
      this.usuarioOriginal.codigoPostal !== this.usuario.codigoPostal;
    }

    return false;
  }

}
