import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipio } from '../model/municipio';
import { Provincia } from '../model/provincia';
import { Comunidad } from '../model/comunidad';
import { PoligonoParcela } from '../model/poligonoParcela';
import { Paraje } from '../model/paraje';
import { Cultivo } from '../model/cultivo';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  staticDataUrl = 'http://localhost:8090/data'

  constructor(private http: HttpClient) { }

  getComunidades(): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(this.staticDataUrl + '/findAllComunidades');
  }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.staticDataUrl + '/findAllProvincias');
  }

  getProvinciasByComunidad(idComunidad: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.staticDataUrl}/findAllProvinciasByIdComunidad/${idComunidad}`);
  }

  getMunicipiosByProvincia(idProvincia: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.staticDataUrl}/findAllMunicipiosByIdProvincia/${idProvincia}`);
  }

  getMunicipioByNombreAndProvincia(municipio: string, provincia: string): Observable<Municipio> {
    return this.http.get<Municipio>(`${this.staticDataUrl}/findMunicipioByNombreAndProvincia/${municipio}/${provincia}`);
  }

  getPoligonoParcelaByFinca(idFinca: string): Observable<PoligonoParcela[]> {
    return this.http.get<PoligonoParcela[]>(`${this.staticDataUrl}/findPoligonoParcelaByFinca/${idFinca}`);
  }

  getParajesByFinca(idFinca: string): Observable<Paraje[]> {
    return this.http.get<Paraje[]>(`${this.staticDataUrl}/findParajeByFinca/${idFinca}`);
  }

  getCultivos(): Observable<Cultivo[]> {
    return this.http.get<Cultivo[]>(`${this.staticDataUrl}/findCultivos`);
  }

  getNombreComunidadById(idComunidad: number | null): Observable<any> {
    return this.http.get<any>(`${this.staticDataUrl}/getNombreComunidadById/${idComunidad}`);
  }

  getNombreProvinciaById(idProvincia: number | null): Observable<any> {
    return this.http.get<any>(`${this.staticDataUrl}/getNombreProvinciaById/${idProvincia}`);
  }

  getNombreMunicipioById(idMunicipio: number | null): Observable<any> {
    return this.http.get<any>(`${this.staticDataUrl}/getNombreMunicipioById/${idMunicipio}`);
  }
}
