import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { Representante } from 'src/app/model/representante';
import { FincaService } from 'src/app/service/finca.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-editar-representante',
  templateUrl: './editar-representante.component.html',
  styleUrls: ['./editar-representante.component.scss']
})
export class EditarRepresentanteComponent implements OnInit, OnDestroy{

  idRepresentante: string = "";
  error: string = "";
  representante: Representante | null = null;
  nombreOriginal: string = "";
  ape1Original: string = "";
  ape2Original: string = "";
  emailOriginal: string = "";
  dniOriginal: string = "";
  telefonoOriginal: string = "";

  private subscription: Subscription | null = null;

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private fincaService: FincaService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idRepresentante = params['id'];
      if (this.idRepresentante) {
        this.usuarioService.findRepresentanteById(this.idRepresentante).subscribe({
          next: (data) => {
            this.representante = data;
            this.nombreOriginal = this.representante.nombre ? this.representante.nombre : "";
            this.ape1Original = this.representante.apellido1 ? this.representante.apellido1 : "";
            this.ape2Original = this.representante.apellido2 ? this.representante.apellido2 : "";
            this.emailOriginal = this.representante.email ? this.representante.email : "";
            this.dniOriginal = this.representante.dni ? this.representante.dni : "";
            this.telefonoOriginal = this.representante.telefono ? this.representante.telefono : "";
          },
          error: (err) => {
            this.error = err.error.message;
            this.toastr.error(this.error, 'Error al cargar el representante', {
              timeOut: 3000, positionClass: 'toast-top-center'
            })
          }
        });
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

  editar() {
    if (this.representante?.nombre === this.nombreOriginal &&
        this.representante.apellido1 === this.ape1Original &&
        this.representante.apellido2 === this.ape2Original &&
        this.representante.email === this.emailOriginal &&
        this.representante.dni === this.dniOriginal &&
        this.representante.telefono === this.telefonoOriginal) 
    {
      this.toastr.warning('No se detectaron cambios', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    const representante = new Representante (
      this.representante?.id ? this.representante.id : null,
      this.representante?.nombre ? this.representante.nombre : null,
      this.representante?.apellido1 ? this.representante.apellido1 : null,
      this.representante?.apellido2 ? this.representante.apellido2 : null,
      this.representante?.idUsuario ? this.representante.idUsuario : null,
      this.representante?.email ? this.representante.email : null,
      this.representante?.dni ? this.representante.dni : null,
      this.representante?.telefono ? this.representante.telefono : null,
      null,
      null
    );

    this.usuarioService.editarRepresentante(representante).subscribe({
      next: (data) => {        
        this.toastr.success('Representante actualizado con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al editar el representante', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        return;
      }
    });

    this.router.navigateByUrl(`/dashboard/ver-perfil/${this.representante?.idUsuario}`);
  }
}
