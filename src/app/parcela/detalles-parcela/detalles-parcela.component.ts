import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ParcelaService } from 'src/app/service/parcela.service';
import { ParcelaConstruccion } from 'src/app/model/parcelaConstruccion';
import { ParcelaInfo } from 'src/app/model/parcelaInfo';
import { SubparcelaInfo } from 'src/app/model/subparcelaInfo';
import { RecintoInfo } from 'src/app/model/recintoInfo';
import { UsuarioParcelaInfo } from 'src/app/model/usuarioParcelaInfo';

@Component({
  selector: 'app-detalles-parcela',
  templateUrl: './detalles-parcela.component.html',
  styleUrls: ['./detalles-parcela.component.scss']
})
export class DetallesParcelaComponent {
  
  parcela: ParcelaInfo | null = null;
  parcelaConstruccion: ParcelaConstruccion | null = null;
  usuariosParcela: UsuarioParcelaInfo[] | null = null;
  subparcelas: SubparcelaInfo[] | null = null;
  recintos: RecintoInfo[] | null = null;
  referenciaCatastral: string = "";
  error: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private parcelaService: ParcelaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.referenciaCatastral = params['referenciaCatastral'];
      if (this.referenciaCatastral) {
        this.loadParcela();
        this.loadUsuarios();
      }
    });
  }

  loadParcela(): void {
    this.parcelaService.findParcelaByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (parcela) => {
        this.parcela = parcela;
        this.loadRecintos();
        this.loadSubparcelas();
      },
      error: (err) => {
        this.parcelaService.findParcelaConstruccionByReferenciaCatastral(this.referenciaCatastral).subscribe({
          next: (parcelaConstruccion) => {
            this.parcelaConstruccion = parcelaConstruccion;
          },
          error: (err) => {
            this.error = err.error.message;
            this.toastr.error(this.error, 'Error al cargar la parcela', {
              timeOut: 3000, positionClass: 'toast-top-center'
            })
          }
        });
      }
    });
  }

  loadSubparcelas(): void {
    this.parcelaService.findSubparcelasByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (subparcelas) => {
        this.subparcelas = subparcelas;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar las subparcelas', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });
  }

  loadRecintos(): void {
    this.parcelaService.findRecintosByReferenciaCatastral(this.referenciaCatastral).subscribe({
      next: (recintos) => {
        this.recintos = recintos;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los recintos', {
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

}
