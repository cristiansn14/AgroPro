import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipio } from '../model/municipio';
import { Provincia } from '../model/provincia';
import { Comunidad } from '../model/comunidad';

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
