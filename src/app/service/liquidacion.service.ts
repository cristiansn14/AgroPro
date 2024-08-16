import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Liquidacion } from '../model/liquidacion';
import { Observable } from 'rxjs';
import { LineaLiquidacion } from '../model/lineaLiquidacion';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  constructor(private http: HttpClient) { }

  liquidacionURL = 'http://localhost:8090/liquidacion';

  public generarLiquidacion (liquidacion: Liquidacion, file?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('liquidacion', new Blob([JSON.stringify(liquidacion)], { type: 'application/json' }));
    if (file) {
      formData.append('documento', file, file.name);
    }

    return this.http.post<any>(this.liquidacionURL + '/generarLiquidacion', formData)
  }

  public findLineasLiquidacionByLiquidacionId (idLiquidacion: string): Observable<LineaLiquidacion[]> {
    return this.http.get<LineaLiquidacion[]>(`${this.liquidacionURL}/findLineasLiquidacionByLiquidacionId/${idLiquidacion}`)
  }

  public findById (idLiquidacion: string): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.liquidacionURL}/findById/${idLiquidacion}`)
  }

  public liquidacionRecibida (lineaLiquidacionDto: LineaLiquidacion): Observable<any> {
    return this.http.post<any>(this.liquidacionURL + '/liquidacionRecibida', lineaLiquidacionDto)
  }

  public findByFincaId(idFinca: string): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.liquidacionURL}/findByFincaId/${idFinca}`);
  }

  public eliminarLiquidacion(idLiquidacion: string): Observable<any> {
    return this.http.delete(`${this.liquidacionURL}/eliminarLiquidacion/${idLiquidacion}`);
  }

}
