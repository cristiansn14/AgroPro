import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Finca } from '../model/finca';
import { UsuarioFinca } from '../model/usuario-finca';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(private httpClient: HttpClient) { }

  fincaURL = 'http://localhost:8090/finca';
  private selectedFincaSource = new BehaviorSubject<string | null>(null);
  selectedFinca$ = this.selectedFincaSource.asObservable();
  
  public getSelectedFinca(): string | null {
    return this.selectedFincaSource.value;
  }
  
  public setSelectedFinca(fincaId: string | null) {
    this.selectedFincaSource.next(fincaId);
  }

  public guardarFinca (fincaDto: Finca): Observable<any> {
    return this.httpClient.post<any>(this.fincaURL + '/guardarFinca', fincaDto)
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

  public getOnzasDisponibles (idFinca: string): Observable<any> {
    return this.httpClient.get<number>(`${this.fincaURL}/getOnzasDisponibles/${idFinca}`)
  }
}
