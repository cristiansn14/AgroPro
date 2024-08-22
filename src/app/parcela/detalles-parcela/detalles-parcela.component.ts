import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ParcelaService } from 'src/app/service/parcela.service';
import { ParcelaConstruccion } from 'src/app/model/parcelaConstruccion';
import { SubparcelaInfo } from 'src/app/model/subparcelaInfo';
import { UsuarioParcelaInfo } from 'src/app/model/usuarioParcelaInfo';
import { Parcela } from 'src/app/model/parcela';
import { FincaService } from 'src/app/service/finca.service';
import { skip, Subscription } from 'rxjs';
import { Finca } from 'src/app/model/finca';
import { Comunidad } from 'src/app/model/comunidad';
import { Provincia } from 'src/app/model/provincia';
import { Municipio } from 'src/app/model/municipio';
import { Subparcela } from 'src/app/model/subparcela';
import { StaticDataService } from 'src/app/service/static-data.service';
import { CatastroService } from 'src/app/service/catastro.service';
import { ParcelaDto } from 'src/app/model/parcelaDto';
import { UsuarioFinca } from 'src/app/model/usuario-finca';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-detalles-parcela',
  templateUrl: './detalles-parcela.component.html',
  styleUrls: ['./detalles-parcela.component.scss']
})
export class DetallesParcelaComponent implements OnInit, OnDestroy{
  
  parcela: Parcela | null = null;
  parcelaConstruccion: ParcelaConstruccion | null = null;
  usuariosParcela: UsuarioParcelaInfo[] | null = null;
  usuariosParcelaBaja: UsuarioParcelaInfo[] | null = null;
  subparcelasInfo: SubparcelaInfo[] | null = null;
  referenciaCatastral: string = "";
  error: string = "";
  private subscription: Subscription | null = null;
  finca!: Finca;
  comunidad!: Comunidad;
  provincia!: Provincia;
  municipio!: Municipio;
  subparcelas: Subparcela[] = [];
  selectedFinca: string | null = null;
  usuarioFinca: UsuarioFinca | null = null;
  rol: string | null = null;
  idUsuario: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private parcelaService: ParcelaService,
    private fincaService: FincaService,
    private router: Router,
    private staticDataService: StaticDataService,
    private catastroService: CatastroService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.referenciaCatastral = params['referenciaCatastral'];
      if (this.referenciaCatastral) {
        this.loadParcela();
        this.loadUsuarios();       
      }
    });

    this.subscription = this.fincaService.selectedFinca$.subscribe(fincaId => {
      this.selectedFinca = fincaId;
      if (this.selectedFinca) {
        this.loadFinca();
        this.getUsuarioFinca();
      }
    });

    this.subscription = this.fincaService.selectedFinca$
    .pipe(skip(1))
    .subscribe(fincaId => {
      this.router.navigateByUrl(`/dashboard/home`);
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

  loadParcela(): void {
    this.parcelaService.findParcelaByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (parcela) => {
        if (parcela.referenciaCatastral !== null) {
          this.parcela = parcela;
          this.loadUsuariosBaja();
          this.loadSubparcelas();
        } else {
          this.parcelaService.findParcelaConstruccionByReferenciaCatastral(this.referenciaCatastral).subscribe({
            next: (parcelaConstruccion) => {
              this.parcelaConstruccion = parcelaConstruccion;
              this.loadUsuariosBaja();
            },
            error: (err) => {
              this.error = err.error.message;
              this.toastr.error(this.error, 'Error al cargar la parcela', {
                timeOut: 3000, positionClass: 'toast-top-center'
              })
            }
          });
        }        
      },
      error: (err) => {                 
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
          
      }
    });
  }

  loadSubparcelas(): void {
    this.parcelaService.findSubparcelasByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (subparcelas) => {
        this.subparcelasInfo = subparcelas;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar las subparcelas', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadUsuarios(): void {
    this.parcelaService.findUsuariosInParcela(this.referenciaCatastral).subscribe({
      next: (usuariosParcela) => {
        this.usuariosParcela = usuariosParcela;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los propietarios', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadUsuariosBaja(){
    this.parcelaService.findUsuariosBajaInParcela(this.referenciaCatastral).subscribe({
      next: (usuariosParcelaBaja) => {
        this.usuariosParcelaBaja = usuariosParcelaBaja;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los propietarios anteriores de la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  actualizarDatos() {
    let refCatastral = this.parcela?.referenciaCatastral;
    if (refCatastral) {
      if (refCatastral.length > 14) {
        refCatastral = refCatastral.substring(0, 14);
      }
      
      this.catastroService.getDatosParcela(this.provincia.id, this.municipio.idMunicipio, refCatastral).subscribe({
        next: (data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");
  
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
              this.parcela?.referenciaCatastral ? this.parcela.referenciaCatastral : null,
              identificador,
              codigoCultivo,
              descripcionCultivo,
              intensidadProductiva,
              superficieSubparcela
            );
            this.subparcelas.push(subparcela);
          }
  
          const parcelaRequest = new Parcela (
            this.parcela?.referenciaCatastral ? this.parcela.referenciaCatastral : null,
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
  
          const parcelaDto: ParcelaDto = new ParcelaDto(      
            parcelaRequest,
            this.subparcelas,
            null
          );
  
          this.parcelaService.actualizarParcela(parcelaDto).subscribe({
            next: response => {
              if (response.status === 304) {
                this.toastr.info('No se realizaron cambios en la parcela.', 'Información', {
                  timeOut: 3000,
                  positionClass: 'toast-top-center'
                });
              } else {
                this.toastr.success('La parcela se ha actualizado correctamente', 'Éxito', {
                  timeOut: 3000,
                  positionClass: 'toast-top-center'
                });
                this.ngOnInit();
              }
            },
            error: err => {
              const errorMessage = err?.error?.message || 'No se han detectado cambios';
              this.toastr.warning(errorMessage, 'Error al guardar la parcela', {
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

  eliminarUsuarioParcela(usuarioParcelaInfo: UsuarioParcelaInfo) {
    this.parcelaService.eliminarUsuarioParcela(usuarioParcelaInfo).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al eliminar el usuario de la parcela', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  getUsuarioFinca() {
    this.idUsuario = this.tokenService.getUserId();
    if (this.idUsuario != null && this.selectedFinca != null) {
      this.fincaService.getUsuarioFincaByUsuarioIdAndFincaId(this.idUsuario, this.selectedFinca).subscribe({
        next: (usuarioFinca) => {
          this.usuarioFinca = usuarioFinca;
          this.rol = this.usuarioFinca != null ? this.usuarioFinca.rol : null;
          console.log(this.rol);
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
