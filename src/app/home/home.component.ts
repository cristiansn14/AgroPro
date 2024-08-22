import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FincaService } from '../service/finca.service';
import { Subscription } from 'rxjs';
import { CatastroService } from '../service/catastro.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  selectedFinca: string | null = null;
  error: string = "";
  username: string = "";
  parcelas: string[] = [];
  selectedParcela: string | null = null;
  private subscription: Subscription | null = null;
  coordenadas: any;
  descripcion: string = "";
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  valorContador!: number;
  mapTypeSatellite: google.maps.MapTypeId = google.maps.MapTypeId.SATELLITE;

  constructor (
    private toastr: ToastrService,
    private fincaService: FincaService,
    private catastroService: CatastroService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      this.username = this.tokenService.getUserName() ?? '';
      if (this.selectedFinca) {       
        this.loadParcelas();
      }     
    }); 
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadParcelas(): void {
    if (this.selectedFinca) {
      this.fincaService.getParcelasByIdFinca(this.selectedFinca).subscribe({
        next: (parcelas) => {
          this.parcelas = parcelas;
          this.selectedParcela = this.parcelas[0];
          this.obtenerCoordenadas();
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

  obtenerCoordenadas() {
    let refCatastral = this.selectedParcela ? this.selectedParcela : "";

    if (refCatastral.length > 0) {
      if (refCatastral.length > 14) {
        refCatastral = refCatastral.substring(0, 14);
      }
      this.catastroService.obtenerCoordenadas(refCatastral).subscribe({
        next: (data) => {
          // Parsear el XML usando DOMParser
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");
  
          // Navegar el documento XML para extraer las coordenadas
          const xcenElement = xmlDoc.getElementsByTagName('xcen')[0];
          const ycenElement = xmlDoc.getElementsByTagName('ycen')[0];
          const ldtElement = xmlDoc.getElementsByTagName('ldt')[0];
  
          if (xcenElement && ycenElement && ldtElement) {
            this.coordenadas = {
              latitud: parseFloat(ycenElement.textContent || '0'),
              longitud: parseFloat(xcenElement.textContent || '0'),
            };
            this.mapCenter = { lat: this.coordenadas.latitud, lng: this.coordenadas.longitud };
            this.descripcion = ldtElement.textContent || '';
          } else {
            this.toastr.error(this.error, 'Error: No se encontraron las coordenadas en la respuesta XML', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
          }
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al obtener las coordenadas', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
        }
      });
    } else {
      if (this.tokenService.getToken()) {
        this.username = this.tokenService.getUserName() ?? '';
      } else {
        this.username = '';
      }
    }  
  }

  onParcelaChange() {
    this.obtenerCoordenadas();
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    const url = `https://sigpac.mapa.gob.es/fega/visor/`;
    window.open(url, '_blank');
  }
}
