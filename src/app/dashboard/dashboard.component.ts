import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
import { FincaService } from '../service/finca.service';
import { Finca } from '../model/finca';
import { ToastrService } from 'ngx-toastr';
import { UsuarioFinca } from '../model/usuario-finca';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  fincas: Finca[] = [];
  usuarioFinca: UsuarioFinca | null = null;
  error: string = "";
  selectedFinca: string | null = null;
  username: string | null = null;
  roles: string[] = [];
  rol: string | null = null;
  idUsuario: string | null = null;
  private subscriptionFoto: Subscription = new Subscription();
  fotoPerfilUrl: string | null = null;

  constructor(
    private observer: BreakpointObserver, 
    private cd: ChangeDetectorRef,
    private tokenService: TokenService,    
    private router: Router,
    private fincaService: FincaService,
    private toastr: ToastrService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getFincasInit();
    this.getFotoPerfil();
    this.subscriptionFoto.add(this.usuarioService.profilePicture$.subscribe(url => {
      if (url) {
        this.fotoPerfilUrl = url;
      }
    }));
    this.username = this.tokenService.getUserName();
    this.idUsuario = this.tokenService.getUserId();
}

  ngOnDestroy(): void {
    if (this.subscriptionFoto) {
      this.subscriptionFoto.unsubscribe();
    }
  }

  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((resp: any) => {
      if(resp.matches){
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }else{
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    })
    this.cd.detectChanges();
  }

  logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
  }

  getFincasInit() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null) {
      this.fincaService.getFincaByUsuarioId(idUsuario).subscribe({
        next: (fincas) => {
          this.fincas = fincas;
          if (this.fincas.length > 0) {
            this.selectedFinca = this.fincas[0].id;  
            this.fincaService.setSelectedFinca(this.selectedFinca);          
          }
          this.getUsuarioFinca();
        },
        error: (error) => {
          this.error = error.error.message;
          this.toastr.error(this.error, 'No registrado en ninguna finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      })
    }   
  }

  getFotoPerfil() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null) {
      this.usuarioService.getFotoPerfil(idUsuario).subscribe({
        next: (foto) => {
          const reader = new FileReader();
          reader.readAsDataURL(foto); 
          reader.onloadend = () => {
            this.fotoPerfilUrl = reader.result as string;
          }
        },
        error: (error) => {
          this.error = error.error.message;
          this.toastr.error(this.error, 'No se pudo cargar la foto de perfil', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      })
    }
  }

  getFincas() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null) {
      this.fincaService.getFincaByUsuarioId(idUsuario).subscribe({
        next: (fincas) => {
          this.fincas = fincas;
          this.getUsuarioFinca();
        },
        error: (error) => {
          this.error = error.error.message;
          this.toastr.error(this.error, 'No registrado en ninguna finca', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      })
    }   
  }

  getUsuarioFinca() {
    const idUsuario = this.tokenService.getUserId();
    if (idUsuario != null && this.selectedFinca != null) {
      this.fincaService.getUsuarioFincaByUsuarioIdAndFincaId(idUsuario, this.selectedFinca).subscribe({
        next: (usuarioFinca) => {
          this.usuarioFinca = usuarioFinca;
          this.rol = this.usuarioFinca != null ? this.usuarioFinca.rol != null ? this.usuarioFinca.rol : null : null;
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

  onFincaChange(event: MatSelectChange) {
    this.selectedFinca = event.value;
    if (this.selectedFinca != null) {
      this.fincaService.setSelectedFinca(this.selectedFinca);
      this.getUsuarioFinca();
    } 
  }
}
