import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/model/usuario';
import { TokenService } from 'src/app/service/token.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './detalles-usuario.component.html',
  styleUrls: ['./detalles-usuario.component.scss']
})
export class DetallesUsuarioComponent implements OnInit{

  usuario: Usuario | null = null;
  idUsuario: string = "";
  error: string = "";

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
      if (this.idUsuario) {
        this.loadUsuario();
      }
    });
  }

  loadUsuario(): void {
    this.usuarioService.findById(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        this.error = err.error.message;
        this.toastr.error(this.error, 'Error al cargar los datos del usuario', {
          timeOut: 3000, positionClass: 'toast-top-center'
        })
      }
    });  
  }
}
