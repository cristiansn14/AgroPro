import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Representante } from 'src/app/model/representante';
import { FincaService } from 'src/app/service/finca.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-crear-representante',
  templateUrl: './crear-representante.component.html',
  styleUrls: ['./crear-representante.component.scss']
})
export class CrearRepresentanteComponent implements OnInit, OnDestroy{

  private subscription: Subscription | null = null;
  idUsuario: string = "";
  error: string = "";

  constructor(
    private usuarioService: UsuarioService, 
    private toastr: ToastrService,
    private fincaService: FincaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
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

  guardar() {
    const nombreHtml = document.getElementById('nombre') as HTMLInputElement;
    const apellido1Html = document.getElementById('apellido1') as HTMLInputElement;
    const apellido2Html = document.getElementById('apellido2') as HTMLInputElement;
    const emailHtml = document.getElementById('email') as HTMLInputElement;
    const dniHtml = document.getElementById('dni') as HTMLInputElement;
    const telefonoHtml = document.getElementById('telefono') as HTMLInputElement;

    if (nombreHtml.value === null || apellido1Html.value === null || apellido2Html.value === null || 
        emailHtml.value === null || dniHtml.value === null || telefonoHtml.value === null) {
          this.toastr.warning('Rellene todos los campos', 'Atención', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
    } else {
      const representante = new Representante (
        null,
        nombreHtml.value,
        apellido1Html.value,
        apellido2Html.value,
        this.idUsuario,
        emailHtml.value,
        dniHtml.value,
        telefonoHtml.value,
        null,
        null
      );

      this.usuarioService.añadirRepresentante(representante).subscribe({
        next: () => {
          this.toastr.success('Representante añadido con éxito', 'Éxito', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigateByUrl(`/dashboard/ver-perfil/${this.idUsuario}`);
        },
        error: (err) => {
          this.error = err.error.message;
          this.toastr.error(this.error, 'Error al crear el representante', {
            timeOut: 3000, positionClass: 'toast-top-center'
          })
        }
      });
    }
  }
}
