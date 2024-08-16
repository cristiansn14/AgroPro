import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChangePassword } from 'src/app/model/changePassword';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{

  idUsuario: string = "";

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
    });
  }

  guardar() {
    const password1Html = document.getElementById('password1') as HTMLInputElement;
    const password2Html = document.getElementById('password2') as HTMLInputElement;

    if (password1Html.value.length === 0 || password2Html.value.length === 0) {
      this.toastr.warning('Rellene ambos campos', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    if (password1Html.value.length <= 7 || password2Html.value.length <= 7) {
      this.toastr.warning('Las contraseñas deben de tener minimo 8 caracteres', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }
    
    if (password1Html.value !== password2Html.value) {
      this.toastr.warning('Las contraseñas no son iguales', 'Atención', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
      return;
    }

    const changePassword = new ChangePassword (
      this.idUsuario,
      password1Html.value,
      password2Html.value
    );

    this.authService.changePassword(changePassword).subscribe({
      next: () => {
        this.toastr.success('Contraseña cambiada con éxito', 'Éxito', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigateByUrl(`/dashboard/ver-perfil/${this.idUsuario}`);  
      },
      error: (err) => {
        this.toastr.error(err, 'Error al cambiar la contraseña', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        return;
      }
    });
  }
}
