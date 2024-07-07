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

  findUsuarioById (idUsuario: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuarioById/${idUsuario}`);
  }
}
