export class RecintoInfo{
    id: string | null;
    referenciaCatastral: string | null;
    recinto: string | null;
    superficie: number | null;
    pendiente: string | null;
    altitud: number | null;
    cultivo: string | null;
    porcentajeSubvencion: string | null;
    superficieSubvencion: number | null;
    coeficienteRegadio: number | null;
    incidencias: string | null;
    region: string | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null; 

    constructor(id: string | null, referenciaCatastral: string | null, recinto: string | null, superficie: number | null, 
            pendiente: string | null, altitud: number | null, cultivo: string | null, porcentajeSubvencion: string | null, 
            superficieSubvencion: number | null, coeficienteRegadio: number | null, incidencias: string | null, 
            region: string | null, fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.referenciaCatastral = referenciaCatastral;
        this.recinto = recinto;
        this.superficie = superficie;
        this.pendiente = pendiente;
        this.altitud = altitud;
        this.cultivo = cultivo;
        this.porcentajeSubvencion = porcentajeSubvencion;
        this.superficieSubvencion = superficieSubvencion;
        this.coeficienteRegadio = coeficienteRegadio;
        this.incidencias = incidencias;
        this.region = region;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}