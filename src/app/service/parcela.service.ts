import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParcelaDto } from '../model/parcelaDto';
import { Observable } from 'rxjs';
import { ParcelaConstruccionDto } from '../model/parcelaConstruccionDto';
import { ParcelaConstruccion } from '../model/parcelaConstruccion';
import { SubparcelaInfo } from '../model/subparcelaInfo';
import { UsuarioParcelaInfo } from '../model/usuarioParcelaInfo';
import { Parcela } from '../model/parcela';
import { UsuarioParcela } from '../model/usuario-parcela';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  parcelaURL = 'http://localhost:8090/parcela';

  constructor(private httpClient: HttpClient) { }

  public guardarParcela (parcelaDto: ParcelaDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/guardarParcela', parcelaDto)
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

  public findUsuarioParcelaById (idUsuarioParcela: string): Observable<UsuarioParcelaInfo> {
    return this.httpClient.get<UsuarioParcelaInfo>(`${this.parcelaURL}/findUsuarioParcelaById/${idUsuarioParcela}`);
  }

  public getParticipacionesDisponibles (referenciaCatastral: string): Observable<any> {
    return this.httpClient.get<number>(`${this.parcelaURL}/getParticipacionesDisponibles/${referenciaCatastral}`);
  }
}
