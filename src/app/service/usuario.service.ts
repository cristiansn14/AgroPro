import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioUrl = 'http://localhost:8090/usuario'

  constructor(private http: HttpClient) { }

  findUsuariosNotInFinca(idFinca: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuariosNotInFinca/${idFinca}`);
  }

  findUsuariosInFinca(idFinca: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuariosInFinca/${idFinca}`);
  }

  findById (idUsuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/findById/${idUsuario}`);
  }

  editarUsuario (usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.usuarioUrl + '/editarUsuario', usuario);
  }


}
