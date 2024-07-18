import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parcela } from '../model/parcela';
import { Subparcela } from '../model/subparcela';
import { Recinto } from '../model/recinto';
import { UsuarioParcela } from '../model/usuario-parcela';
import { ParcelaDto } from '../model/parcelaDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  parcelaURL = 'http://localhost:8090/parcela';

  constructor(private httpClient: HttpClient) { }

  public guardarParcela (parcelaDto: ParcelaDto): Observable<any> {
    return this.httpClient.post<any>(this.parcelaURL + '/guardarParcela', parcelaDto)
  }
}
