import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { Representante } from '../model/representante';
import { UsuarioInfo } from '../model/usuarioInfo';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioUrl = 'http://localhost:8090/usuario'

  constructor(private http: HttpClient) { }

  private profilePictureSource = new BehaviorSubject<string>('');
  profilePicture$ = this.profilePictureSource.asObservable();

  updateProfilePicture(newUrl: string) {
    this.profilePictureSource.next(newUrl);
  }

  findUsuariosNotInFinca(idFinca: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuariosNotInFinca/${idFinca}`);
  }

  findUsuariosInFinca(idFinca: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuariosInFinca/${idFinca}`);
  }

  findById (idUsuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/findById/${idUsuario}`);
  }

  editarUsuario(usuario: Usuario, file?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (file) {
      formData.append('foto', file, file.name);
    }

    return this.http.post<any>(this.usuarioUrl + '/editarUsuario', formData, { observe: 'response' });
  }

  getFotoPerfil(idUsuario: string): Observable<Blob> {
    return this.http.get(`${this.usuarioUrl}/getFotoPerfil/${idUsuario}`, { responseType: 'blob' });
  }

  public añadirRepresentante (representanteDto: Representante): Observable<any> {
    return this.http.post<any>(this.usuarioUrl + '/añadirRepresentante', representanteDto);
  }

  public editarRepresentante (representante: Representante): Observable<any> {
    return this.http.post<any>(`${this.usuarioUrl}/editarRepresentante`, representante, { observe: 'response' });
  }

  public eliminarRepresentante (representante: Representante): Observable<any> {
    return this.http.post<any>(`${this.usuarioUrl}/eliminarRepresentante`, representante);
  }

  public findRepresentantesByIdUsuario (idUsuario: string): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.usuarioUrl}/findRepresentantesByIdUsuario/${idUsuario}`);
  }

  public findRepresentanteById (idRepresentante: string): Observable<Representante> {
    return this.http.get<Representante>(`${this.usuarioUrl}/findRepresentanteById/${idRepresentante}`);
  }

  public findUsuariosByFincaAndNotInParcela(idFinca: string, referenciaCatastral: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.usuarioUrl}/findUsuariosByFincaAndNotInParcela/${idFinca}/${referenciaCatastral}`);
  }

  public findAllUsuariosAlta(): Observable<UsuarioInfo[]> {
    return this.http.get<UsuarioInfo[]>(`${this.usuarioUrl}/findAllUsuariosAlta`);
  }

  public findAllUsuariosBaja(): Observable<UsuarioInfo[]> {
    return this.http.get<UsuarioInfo[]>(`${this.usuarioUrl}/findAllUsuariosBaja`);
  }

  public darAltaUsuario(idUsuario: string): Observable<any> {
    return this.http.put<any>(`${this.usuarioUrl}/darAltaUsuario`, JSON.stringify(idUsuario), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public darBajaUsuario(idUsuario: string): Observable<any> {
    return this.http.delete(`${this.usuarioUrl}/darBajaUsuario/${idUsuario}`);
  }
}
