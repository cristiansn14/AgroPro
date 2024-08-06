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
}
