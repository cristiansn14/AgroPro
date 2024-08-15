import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParcelaDto } from '../model/parcelaDto';
import { Observable } from 'rxjs';
import { ParcelaConstruccionDto } from '../model/parcelaConstruccionDto';
import { ParcelaConstruccion } from '../model/parcelaConstruccion';
import { SubparcelaInfo } from '../model/subparcelaInfo';
import { UsuarioParcelaInfo } from '../model/usuarioParcelaInfo';
import { Parcela } from '../model/parcela';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  parcelaURL = 'http://localhost:8090/parcela';

  constructor(private httpClient: HttpClient) { }

  public guardarParcela (parcelaDto: ParcelaDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/guardarParcela', parcelaDto)
  }

  public guardarParcelaConstruccion (parcelaConstruccionDto: ParcelaConstruccionDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/guardarParcelaConstruccion', parcelaConstruccionDto)
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
}
