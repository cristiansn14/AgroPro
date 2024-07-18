export class ParcelaConstruccion{
    referenciaCatastral: string | null;
    idFinca: string | null;   
    superficie: number | null;
    escalera: number | null;
    planta: number | null;
    puerta: number | null; 
    tipoReforma: string | null;
    fechaReforma: Date | null;  

    constructor(referenciaCatastral: string | null, idFinca: string | null, superficie: number | null, escalera: number | null, 
                planta: number | null, puerta: number | null, tipoReforma: string | null, fechaReforma: Date | null) {
        this.referenciaCatastral = referenciaCatastral;
        this.idFinca = idFinca;
        this.superficie = superficie;
        this.escalera = escalera;
        this.referenciaCatastral = referenciaCatastral;
        this.planta = planta;
        this.puerta = puerta;
        this.tipoReforma = tipoReforma;
        this.fechaReforma = fechaReforma;
    }
}