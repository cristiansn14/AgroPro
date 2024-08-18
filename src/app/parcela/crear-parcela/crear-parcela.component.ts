import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subparcela } from 'src/app/model/subparcela';
import { Parcela } from 'src/app/model/parcela'; 
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/service/usuario.service';
import { FincaService } from 'src/app/service/finca.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/model/usuario';
import { ParcelaConstruccion } from 'src/app/model/parcelaConstruccion';
import { StaticDataService } from 'src/app/service/static-data.service';
import { ParcelaDto } from 'src/app/model/parcelaDto';
import { ParcelaConstruccionDto } from 'src/app/model/parcelaConstruccionDto'
import { ParcelaService } from 'src/app/service/parcela.service';
import { UsuarioParcela } from 'src/app/model/usuario-parcela';
import { CatastroService } from 'src/app/service/catastro.service';
import { Finca } from 'src/app/model/finca';
import { Comunidad } from 'src/app/model/comunidad';
import { Provincia } from 'src/app/model/provincia';
import { Municipio } from 'src/app/model/municipio';
import { Router } from '@angular/router';

export function uniqueUserValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      const ids = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['usuario'].value)
        .filter(id => id != null);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        return { duplicateUser: true };
      }
    }
    return null;
  };
}

export function participacionSumaValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      const participaciones = formArray.controls
        .map(formGroup => (formGroup as FormGroup).controls['participacion'].value)
        .filter(value => value !== null && value !== undefined);
      
      const sumaTotal = participaciones.reduce((acc, curr) => acc + curr, 0);
      
      return sumaTotal <= 100 ? null : { participacionTotalInvalida: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-crear-parcela',
  templateUrl: './crear-parcela.component.html',
  styleUrls: ['./crear-parcela.component.scss']
})

export class CrearParcelaComponent implements OnInit, OnDestroy {
  usuariosDisponibles: Usuario[] = [];
  propietariosForm!: FormGroup;
  propietarioRows: any[][] = [];
  tipoParcela: string = '';
  numeroPropietarios: number = 0;
  private subscription: Subscription | null = null;
  selectedFinca: string | null = null;
  error: string = "";
  finca!: Finca;
  comunidad!: Comunidad;
  provincia!: Provincia;
  municipio!: Municipio;
  subparcelas: Subparcela[] = [];

  constructor(
    private usuarioService: UsuarioService, 
    private fb: FormBuilder,
    private fincaService: FincaService,
    private toastr: ToastrService,
    private staticDataService: StaticDataService,
    private parcelaService: ParcelaService,
    private catastroService: CatastroService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tipoParcela = '';
    this.numeroPropietarios = 0;

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadUsuariosDisponibles();
        this.loadFinca();
      }
      this.initPropietariosForm();
    });
  }

  loadUsuariosDisponibles() {
    if (this.selectedFinca) {
      this.usuarioService.findUsuariosInFinca(this.selectedFinca).subscribe({
        next: (usuarios) => {
          this.usuariosDisponibles = usuarios;
          this.updatePropietariosValidators();
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener usuarios disponibles', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }

  updatePropietariosValidators() {
    const propietarios = this.propietariosForm.get('propietarios') as FormArray;
    propietarios.clearValidators();
    propietarios.setValidators(Validators.compose([
      uniqueUserValidator(),
      participacionSumaValidator()
    ]));
    propietarios.updateValueAndValidity();
  }

  loadFinca(): void {
    if (this.selectedFinca) {
      this.fincaService.findById(this.selectedFinca).subscribe({
        next: (fincaDto) => {
          this.finca = fincaDto; 
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

  private initPropietariosForm() {
    this.propietariosForm = this.fb.group({
      propietarios: this.fb.array([], Validators.compose([
        uniqueUserValidator(),
        participacionSumaValidator()
      ]))
    });
    this.addPropietarioForms();
  }

  private addPropietarioForms() {
    const propietariosArray = this.propietariosForm.get('propietarios') as FormArray;
    propietariosArray.clear();
    for (let i = 0; i < this.numeroPropietarios; i++) {
      propietariosArray.push(this.createPropietarioForm());
    }
  }

  generarFormularioPropietarios(){
    const cantidadActual = this.propietarios.length;

    if (this.numeroPropietarios > cantidadActual) {
      // Agregar nuevos formularios
      for (let i = cantidadActual; i < this.numeroPropietarios; i++) {
        this.propietarios.push(this.createPropietarioForm());
      }
    } else if (this.numeroPropietarios < cantidadActual) {
      // Eliminar formularios excedentes
      for (let i = cantidadActual; i > this.numeroPropietarios; i--) {
        this.propietarios.removeAt(i - 1);
      }
    }

    // Dividir los formularios en filas de 3
    this.propietarioRows = [];
    for (let i = 0; i < this.propietarios.length; i += 3) {
      this.propietarioRows.push(this.propietarios.controls.slice(i, i + 3));
    }   
  }

  createPropietarioForm(): FormGroup {
    const propietarioForm = this.fb.group({
      usuario: ['', Validators.required],
      participacion: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    return propietarioForm;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByFn(index: number, item: any): number {
    return index; 
  }

  get propietarios(): FormArray {
    return this.propietariosForm.get('propietarios') as FormArray;
  }

  guardar(): void {
    if (this.tipoParcela === "construccion"){
      if (this.propietariosForm.get('propietarios')?.value.length === 0) {
        this.toastr.error('Debe haber al menos un propietario.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }

      if (this.propietariosForm.get('propietarios')?.hasError('duplicateUser')) {
        this.toastr.error('No se puede añadir el mismo usuario más de una vez.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }

      if (this.propietariosForm.get('propietarios')?.hasError('participacionTotalInvalida')) {
        this.toastr.error('La participación total no puede superar el 100%.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }

      if (this.propietariosForm.invalid) {
        this.toastr.error('Formulario no válido, faltan campos o alguno es erróneo', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }

      const referenciaHtml = document.getElementById('referenciaC') as HTMLInputElement;
      const usoPrincipalHtml = document.getElementById('usoPrincipalC') as HTMLInputElement;
      const escaleraHtml = document.getElementById('escaleraC') as HTMLInputElement;
      const plantaHtml = document.getElementById('plantaC') as HTMLInputElement;
      const puertaHtml = document.getElementById('puertaC') as HTMLInputElement;
      const tipoReformaHtml = document.getElementById('tipoReformaC') as HTMLInputElement;
      const fechaReformaHtml = document.getElementById('fechaReformaC') as HTMLInputElement;
      const superficieHtml = document.getElementById('superficieC') as HTMLInputElement;

      if (!referenciaHtml?.value ||
        !usoPrincipalHtml?.value ||
        !escaleraHtml?.value ||
        !plantaHtml?.value ||
        !puertaHtml?.value ||
        !superficieHtml?.value
      ) {
        this.toastr.warning('Campos obligatorios sin rellenar', 'Atención', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }

      const parcelaConstruccion = new ParcelaConstruccion (
        referenciaHtml.value,
        this.selectedFinca,
        Number(superficieHtml.value),
        Number(escaleraHtml.value),        
        Number(plantaHtml.value),
        Number(puertaHtml.value),
        tipoReformaHtml ? tipoReformaHtml.value : null,
        fechaReformaHtml ? new Date(fechaReformaHtml.value) : null,
        usoPrincipalHtml.value,
        null,
        null,
        null
      );

      const usuariosParcelaRequestDto = (this.propietariosForm.get('propietarios') as FormArray).controls.map(control => new UsuarioParcela(
        null,
        control.get('participacion')?.value,
        control.get('usuario')?.value,
        null, 
        null, 
        null,
        null
      ));

      const parcelaConstruccionDto = new ParcelaConstruccionDto (
        parcelaConstruccion,
        usuariosParcelaRequestDto
      );
        
      this.parcelaService.guardarParcelaConstruccion(parcelaConstruccionDto).subscribe({
        next: response => {
          this.toastr.success('La parcela se ha añadido correctamente.', 'Éxito', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/detalles-parcela/${referenciaHtml.value}`);
        },
        error: err => {
          this.toastr.error(err.error.message, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
      });

    } else {
      if (this.propietariosForm.get('propietarios')?.value.length === 0) {
        this.toastr.error('Debe haber al menos un propietario.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
  
      if (this.propietariosForm.get('propietarios')?.hasError('duplicateUser')) {
        this.toastr.error('No se puede añadir el mismo usuario más de una vez.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }

      if (this.propietariosForm.get('propietarios')?.hasError('participacionTotalInvalida')) {
        this.toastr.error('La participación total no puede superar el 100%.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return; 
      }

      if (this.propietariosForm.invalid) {
        this.toastr.error('Formulario no válido, faltan campos o alguno es erróneo', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }

      const refCatastralHtml = document.getElementById('referencia') as HTMLInputElement;
      let refCatastral = refCatastralHtml.value;

      if (refCatastral.length === 0) {
        this.toastr.error('Por favor, introduzca una Referencia catastral', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
      
      if (refCatastral.length > 14) {
        refCatastral = refCatastral.substring(0, 14);
      }

      this.catastroService.getDatosParcela(this.provincia.id, this.municipio.idMunicipio, refCatastral).subscribe({
        next: (data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          const cuerr = xmlDoc.getElementsByTagName('cuerr')[0]?.textContent;
          if (cuerr && cuerr === '1') {
            const errorCode = xmlDoc.getElementsByTagName('cod')[0]?.textContent;
            const errorDescription = xmlDoc.getElementsByTagName('des')[0]?.textContent;

            this.toastr.error(`Error ${errorCode}: ${errorDescription}`, 'Error al obtener la parcela desde Catastro', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });

            return;
          }

          let poligono = xmlDoc.getElementsByTagName('cpo')[0].textContent;
          let parcela = xmlDoc.getElementsByTagName('cpa')[0].textContent;
          let paraje = xmlDoc.getElementsByTagName('npa')[0].textContent;
          let clase = xmlDoc.getElementsByTagName('cn')[0].textContent;
          if (clase === "RU") {
            clase = "Rústico";
          }
          let usoPrincipal = xmlDoc.getElementsByTagName('luso')[0].textContent;

          let sprNodos = xmlDoc.getElementsByTagName('spr');
          let superficieParcela = 0.0;
          for (let i = 0; i < sprNodos.length; i++) {
            const sprNodo = sprNodos[i];
            let identificador = sprNodo.getElementsByTagName('cspr')[0].textContent;
            let codigoCultivo = sprNodo.getElementsByTagName('ccc')[0].textContent;
            let descripcionCultivo = sprNodo.getElementsByTagName('dcc')[0].textContent;
            let intensidadProductiva = sprNodo.getElementsByTagName('ip')[0].textContent;
            let superficieSubparcela = parseFloat(sprNodo.getElementsByTagName('ssp')[0]?.textContent ?? '0');
          
            superficieParcela += superficieSubparcela;
            const subparcela = new Subparcela (
              null,
              refCatastralHtml.value,
              identificador,
              codigoCultivo,
              descripcionCultivo,
              intensidadProductiva,
              superficieSubparcela
            );
            this.subparcelas.push(subparcela);
          }

          const parcelaRequest = new Parcela (
            refCatastralHtml.value,
            poligono,
            parcela,
            paraje,
            this.selectedFinca,
            clase,
            usoPrincipal,
            superficieParcela,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          );

          const usuariosParcelaRequest = (this.propietariosForm.get('propietarios') as FormArray).controls.map(control => new UsuarioParcela(
            null,
            control.get('participacion')?.value,
            control.get('usuario')?.value,
            null, 
            null, 
            null,
            null
          ));

          const parcelaDto: ParcelaDto = new ParcelaDto(      
            parcelaRequest,
            this.subparcelas,
            usuariosParcelaRequest
          );

          this.parcelaService.guardarParcela(parcelaDto).subscribe({
            next: response => {
              this.toastr.success('La parcela se ha añadido correctamente.', 'Éxito', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
              this.router.navigateByUrl(`/dashboard/detalles-parcela/${refCatastralHtml.value}`);
            },
            error: err => {
              this.toastr.error(err.error.message, 'Error al guardar la parcela', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
            }
          });
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener la parcela desde Catastro', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          return;
        }
      });
    }
  }  
}
