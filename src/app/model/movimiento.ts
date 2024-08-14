import { Archivo } from "./archivo";

export class Movimiento {
    id: string | null;
    fecha: Date | null;
    concepto: string | null;
    tipo: string | null;
    importe: number | null;
    idFinca: string | null;
    idArchivo: string | null;
    nombreArchivo: string | null;
    tipoArchivo: string | null;

    constructor(id: string | null, concepto: string | null, tipo: string | null, importe: number | null, 
                idFinca: string | null, fecha: Date | null, idArchivo: string | null,
                nombreArchivo: string | null, tipoArchivo: string | null) {
        this.id = id;
        this.concepto = concepto;
        this.tipo = tipo;
        this.importe = importe;
        this.idFinca = idFinca;
        this.idArchivo = idArchivo;
        this.tipoArchivo = tipoArchivo;
        this.nombreArchivo = nombreArchivo;
        this.fecha = fecha;
    }
}