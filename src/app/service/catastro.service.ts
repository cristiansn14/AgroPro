import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatastroService {

  private catastroUrl = 'https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/';

  constructor(private http: HttpClient) {}

  obtenerCoordenadas(refCatastral: string): Observable<any> {
    const url = `${this.catastroUrl}Consulta_CPMRC?Provincia=&Municipio=&SRS=EPSG:4326&RC=${refCatastral}`;
    return this.http.get(url, { responseType: 'text' });
  }

}
