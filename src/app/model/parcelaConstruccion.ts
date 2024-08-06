export class ParcelaConstruccion{
    referenciaCatastral: string | null;
    idFinca: string | null;   
    superficie: number | null;
    usoPrincipal: string | null;
    escalera: number | null;
    planta: number | null;
    puerta: number | null; 
    tipoReforma: string | null;
    fechaReforma: string | null; 
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null; 

    constructor(referenciaCatastral: string | null, idFinca: string | null, superficie: number | null, escalera: number | null, 
                planta: number | null, puerta: number | null, tipoReforma: string | null, fechaReforma: string | null, 
                usoPrincipal: string | null, fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.referenciaCatastral = referenciaCatastral;
        this.idFinca = idFinca;
        this.superficie = superficie;
        this.escalera = escalera;
        this.usoPrincipal = usoPrincipal;
        this.planta = planta;
        this.puerta = puerta;
        this.tipoReforma = tipoReforma;
        this.fechaReforma = fechaReforma;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}