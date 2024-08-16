import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movimiento } from '../model/movimiento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  constructor(private http: HttpClient) { }

  movimientoURL = 'http://localhost:8090/movimiento';

  guardarMovimiento(movimiento: Movimiento, file?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('movimiento', new Blob([JSON.stringify(movimiento)], { type: 'application/json' }));
    if (file) {
      formData.append('documento', file, file.name);
    }

    return this.http.post<any>(this.movimientoURL + '/crearMovimiento', formData);
  }

  findByFincaId(idFinca: string): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.movimientoURL}/findByFincaId/${idFinca}`);
  }

  findArchivoById(idArchivo: string): Observable<any> {
    return this.http.get(`${this.movimientoURL}/findArchivoById/${idArchivo}`, { responseType: 'blob' });
  }

  getArchivoUrl(idArchivo: string): string {
    return `${this.movimientoURL}/findArchivoById/${idArchivo}`;
  }

  public eliminarMovimiento(idMovimiento: string): Observable<any> {
    return this.http.delete(`${this.movimientoURL}/eliminarMovimiento/${idMovimiento}`);
  }
}
