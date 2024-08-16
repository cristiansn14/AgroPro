import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comunidad } from 'src/app/model/comunidad';
import { Finca } from 'src/app/model/finca';
import { Municipio } from 'src/app/model/municipio';
import { Provincia } from 'src/app/model/provincia';
import { FincaService } from 'src/app/service/finca.service';
import { StaticDataService } from 'src/app/service/static-data.service';

@Component({
  selector: 'app-crear-finca',
  templateUrl: './crear-finca.component.html',
  styleUrls: ['./crear-finca.component.scss']
})

export class CrearFincaComponent implements OnInit {
  
  fincaDto: Finca | undefined;
  nombre: string = "";
  onzas: number = 0;
  error: string = "";
  comunidades: Comunidad[] = [];
  provincias:  Provincia[] = [];
  municipios: Municipio[] = [];
  selectedMunicipio: number | null = null;
  selectedProvincia: number | null = null;
  selectedComunidad: number | null = null;

  constructor(
    private fincaService: FincaService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: StaticDataService
  ) { }
  
  ngOnInit(): void {
    this.loadComunidades();
    this.loadProvincias();
  } 

  loadComunidades() {
    this.dataService.getComunidades().subscribe(data => {
      this.comunidades = data;
    });
  }

  loadProvincias() {
    this.dataService.getProvincias().subscribe(data => {
      this.provincias = data;
    });
  }

  onComunidadChange() {
    if (this.selectedComunidad != null) {
      this.dataService.getProvinciasByComunidad(this.selectedComunidad).subscribe({
        next: (data) => {
          this.provincias = data;
          this.municipios = [];         
          this.selectedMunicipio = null;
          this.selectedProvincia = null;
          if (this.provincias.length === 1) {
            this.selectedProvincia = this.provincias[0].id;
            this.onProvinciaChange();
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

  crear(){
    const nombreHtml = document.getElementById('nombre') as HTMLInputElement;
    const onzasHtml = document.getElementById('onzas') as HTMLInputElement;

    if (Number(onzasHtml.value) <= 0) {
      this.toastr.warning('El número de onzas no puede ser 0', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    if (nombreHtml.value !== null || Number(onzasHtml.value !== null) || this.selectedComunidad !== null || this.selectedProvincia !== null || this.selectedMunicipio !== null) {
      this.fincaDto = new Finca (
        null,
        nombreHtml.value,
        Number(onzasHtml.value),
        this.selectedComunidad,
        this.selectedProvincia,
        this.selectedMunicipio,
        null,
        null,
        null
      );
  
      this.fincaService.guardarFinca(this.fincaDto).subscribe({
        next: (data) => {        
          this.toastr.success('Finca ' + this.fincaDto?.nombre + ' creada correctamente', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/dashboard/home']);
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al guardar la finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    } else {
      this.toastr.warning('No se han rellenado los campos necesarios', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }  

  }

}
