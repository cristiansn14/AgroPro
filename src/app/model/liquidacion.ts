export class Liquidacion{
    id: string | null;
    concepto: string | null;
    tipo: string | null;
    importeTotal: number | null;      
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    idFinca: string | null;
    fecha: Date | null;
    idArchivo: string | null;
    nombreArchivo: string | null;
    tipoArchivo: string | null;

    constructor(id: string | null, concepto: string | null, tipo: string | null, importeTotal: number | null,  
                fechaDesde: Date | null, fechaHasta: Date | null, idFinca: string | null, fecha: Date | null,
                idArchivo: string | null, nombreArchivo: string | null, tipoArchivo: string | null) {
        this.id = id;
        this.concepto = concepto;
        this.tipo = tipo;
        this.importeTotal = importeTotal;
        this.fechaDesde = fechaDesde;
        this.fechaHasta = fechaHasta;
        this.idFinca = idFinca;
        this.fecha = fecha;
        this.idArchivo = idArchivo;
        this.tipoArchivo = tipoArchivo;
        this.nombreArchivo = nombreArchivo;
    }
}