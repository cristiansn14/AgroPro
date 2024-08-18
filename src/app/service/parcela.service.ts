import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParcelaDto } from '../model/parcelaDto';
import { Observable } from 'rxjs';
import { ParcelaConstruccionDto } from '../model/parcelaConstruccionDto';
import { ParcelaConstruccion } from '../model/parcelaConstruccion';
import { SubparcelaInfo } from '../model/subparcelaInfo';
import { UsuarioParcelaInfo } from '../model/usuarioParcelaInfo';
import { Parcela } from '../model/parcela';
import { UsuarioParcela } from '../model/usuario-parcela';
import { Subparcela } from '../model/subparcela';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  parcelaURL = 'http://localhost:8090/parcela';

  token = localStorage.getItem('token');

  constructor(
    private httpClient: HttpClient, 
    private tokenService: TokenService
  ) { }

  public guardarParcela (parcelaDto: ParcelaDto): Observable<any> {
    return this.httpClient.post<any>(`${this.parcelaURL}/guardarParcela`, parcelaDto)
  }

  public actualizarParcela (parcelaDto: ParcelaDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/actualizarParcela', parcelaDto, { observe: 'response' })
  }

  public editarParcela (parcela: Parcela): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/editarParcela', parcela, { observe: 'response' })
  }

  public guardarParcelaConstruccion (parcelaConstruccionDto: ParcelaConstruccionDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/guardarParcelaConstruccion', parcelaConstruccionDto)
  }

  public editarParcelaConstruccion (parcelaConstruccion: ParcelaConstruccion): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/editarParcelaConstruccion', parcelaConstruccion , { observe: 'response' })
  }

  public crearUsuarioParcela (usuarioParcelaDto: UsuarioParcela[]): Observable<any> {
    return this.httpClient.post<any>(`${this.parcelaURL}/crearUsuarioParcela`, usuarioParcelaDto);
  }

  public editarUsuarioParcela (usuarioParcelaDto: UsuarioParcelaInfo): Observable<any> {
    return this.httpClient.post<any>(`${this.parcelaURL}/editarUsuarioParcela`, usuarioParcelaDto , { observe: 'response' });
  }

  public eliminarUsuarioParcela (usuarioParcelaDto: UsuarioParcelaInfo): Observable<any> {
    return this.httpClient.post<any>(`${this.parcelaURL}/eliminarUsuarioParcela`, usuarioParcelaDto);
  }

  public findParcelaByReferenciaCatastral (referenciaCatastral: string): Observable<Parcela> {
    return this.httpClient.get<Parcela>(`${this.parcelaURL}/findParcelaByReferenciaCatastral/${referenciaCatastral}`);
  }

  public findParcelaConstruccionByReferenciaCatastral (referenciaCatastral: string): Observable<ParcelaConstruccion> {
    return this.httpClient.get<ParcelaConstruccion>(`${this.parcelaURL}/findParcelaConstruccionByReferenciaCatastral/${referenciaCatastral}`);
  }

  public findSubparcelasByReferenciaCatastral (referenciaCatastral: string): Observable<SubparcelaInfo[]> {
    return this.httpClient.get<SubparcelaInfo[]>(`${this.parcelaURL}/findSubparcelasByReferenciaCatastral/${referenciaCatastral}`);
  }

  public findUsuariosInParcela (referenciaCatastral: string): Observable<UsuarioParcelaInfo[]> {
    return this.httpClient.get<UsuarioParcelaInfo[]>(`${this.parcelaURL}/findUsuariosInParcela/${referenciaCatastral}`);
  }

  public findUsuariosBajaInParcela (referenciaCatastral: string): Observable<UsuarioParcelaInfo[]> {
    return this.httpClient.get<UsuarioParcelaInfo[]>(`${this.parcelaURL}/findUsuariosBajaInParcela/${referenciaCatastral}`);
  }

  public findUsuarioParcelaById (idUsuarioParcela: string): Observable<UsuarioParcelaInfo> {
    return this.httpClient.get<UsuarioParcelaInfo>(`${this.parcelaURL}/findUsuarioParcelaById/${idUsuarioParcela}`);
  }

  public getParticipacionesDisponibles (referenciaCatastral: string): Observable<any> {
    return this.httpClient.get<number>(`${this.parcelaURL}/getParticipacionesDisponibles/${referenciaCatastral}`);
  }

  public darAltaParcela(referenciaCatastral: string): Observable<any> {
    return this.httpClient.put<any>(`${this.parcelaURL}/darAltaParcela`, referenciaCatastral, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  public darBajaParcela(referenciaCatastral: string): Observable<any> {
    return this.httpClient.delete(`${this.parcelaURL}/darBajaParcela/${referenciaCatastral}`);
  }

  getAuthHeader() {
    return {"Authorization":this.tokenService.getBearerToken()};
  }
}
