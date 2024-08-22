import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Finca } from '../model/finca';
import { UsuarioFinca } from '../model/usuario-finca';
import { UsuarioFincaInfo } from '../model/usuarioFincaInfo';
import { Archivo } from '../model/archivo';
import { FincaInfo } from '../model/fincaInfo';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(private httpClient: HttpClient) { }

  fincaURL = 'http://localhost:8090/finca';
  private selectedFincaSource = new BehaviorSubject<string | null>(null);
  selectedFinca$ = this.selectedFincaSource.asObservable();
  private fincaModifiedSource = new Subject<void>();
  fincaModified$ = this.fincaModifiedSource.asObservable();
  
  public getSelectedFinca(): string | null {
    return this.selectedFincaSource.value;
  }
  
  public setSelectedFinca(fincaId: string | null) {
    this.selectedFincaSource.next(fincaId);
  }

  public notifyFincaModified() {
    this.fincaModifiedSource.next();
  }

  public guardarFinca (fincaDto: Finca): Observable<any> {
    return this.httpClient.post<any>(this.fincaURL + '/guardarFinca', fincaDto)
  }

  public editarFinca (fincaDto: Finca): Observable<any> {
    return this.httpClient.post<any>(this.fincaURL + '/editarFinca', fincaDto , { observe: 'response' })
  }

  public getFincaByUsuarioId (idUsuario: String): Observable<any> {
    return this.httpClient.get<Finca[]>(`${this.fincaURL}/findAllFincasByUsuarioId/${idUsuario}`);
  }

  public getUsuarioFincaByUsuarioIdAndFincaId (idUsuario: String, idFinca: String): Observable<any> {
    return this.httpClient.get<UsuarioFinca>(`${this.fincaURL}/findUsuarioFincaByUsuarioIdAndFincaId/${idUsuario}/${idFinca}`);
  }

  public addUsuariosFinca (usuariosFinca: UsuarioFinca[]): Observable<any> {
    return this.httpClient.post<any>(`${this.fincaURL}/addUsuariosFinca`, usuariosFinca);
  }

  public editarUsuarioFinca (usuarioFinca: UsuarioFinca): Observable<any> {
    return this.httpClient.post<any>(`${this.fincaURL}/editarUsuarioFinca`, usuarioFinca , { observe: 'response' });
  }

  public eliminarUsuarioFinca (usuarioFinca: UsuarioFinca): Observable<any> {
    return this.httpClient.post<any>(`${this.fincaURL}/eliminarUsuarioFinca`, usuarioFinca);
  }

  public getOnzasDisponibles (idFinca: string): Observable<any> {
    return this.httpClient.get<number>(`${this.fincaURL}/getOnzasDisponibles/${idFinca}`)
  }

  public findById (idFinca: string): Observable<any> {
    return this.httpClient.get<any>(`${this.fincaURL}/findById/${idFinca}`)
  }

  public getParcelasByIdFinca (idFinca: string): Observable<any> {
    return this.httpClient.get<any>(`${this.fincaURL}/getParcelasByIdFinca/${idFinca}`)
  }

  public getParcelasBajaByIdFinca (idFinca: string): Observable<any> {
    return this.httpClient.get<any>(`${this.fincaURL}/getParcelasBajaByIdFinca/${idFinca}`)
  }

  public findUsuariosFincaByFincaId (idFinca: string): Observable<UsuarioFincaInfo[]> {
    return this.httpClient.get<UsuarioFincaInfo[]>(`${this.fincaURL}/findUsuariosFincaByFincaId/${idFinca}`)
  }

  public findUsuariosFincaBajaByFincaId (idFinca: string): Observable<UsuarioFincaInfo[]> {
    return this.httpClient.get<UsuarioFincaInfo[]>(`${this.fincaURL}/findUsuariosFincaBajaByFincaId/${idFinca}`)
  }

  public findUsuarioFincaById (idUsuarioFinca: string): Observable<UsuarioFincaInfo> {
    return this.httpClient.get<UsuarioFincaInfo>(`${this.fincaURL}/findUsuarioFincaById/${idUsuarioFinca}`)
  }

  public findArchivosByIdFinca (idFinca: string): Observable<Archivo[]> {
    return this.httpClient.get<Archivo[]>(`${this.fincaURL}/findArchivosByIdFinca/${idFinca}`)
  }

  public eliminarArchivo(idArchivo: string): Observable<any> {
    return this.httpClient.delete(`${this.fincaURL}/eliminarArchivo/${idArchivo}`);
  }

  public guardarArchivo(idFinca: string, file?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('idFinca', new Blob([JSON.stringify(idFinca)], { type: 'application/json' }));
    if (file) {
      formData.append('archivo', file, file.name);
    }

    return this.httpClient.post<any>(this.fincaURL + '/guardarArchivo', formData, { observe: 'response' });
  }

  public findAllFincasAltaByUsuarioId (idUsuario: String): Observable<any> {
    return this.httpClient.get<FincaInfo[]>(`${this.fincaURL}/findAllFincasAltaByUsuarioId/${idUsuario}`);
  }

  public findAllFincasBajaByUsuarioId (idUsuario: String): Observable<any> {
    return this.httpClient.get<FincaInfo[]>(`${this.fincaURL}/findAllFincasBajaByUsuarioId/${idUsuario}`);
  }

  public darAltaFinca(idFinca: string): Observable<any> {
    return this.httpClient.put<any>(`${this.fincaURL}/darAltaFinca`, JSON.stringify(idFinca), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public darBajaFinca(idFinca: string): Observable<any> {
    return this.httpClient.delete(`${this.fincaURL}/darBajaFinca/${idFinca}`);
  }

  public eliminarFinca(idFinca: string): Observable<any> {
    return this.httpClient.delete(`${this.fincaURL}/eliminarFinca/${idFinca}`);
  }

}
