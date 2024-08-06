export class SubparcelaInfo{
    id: string | null;
    referenciaCatastral: string | null;
    subparcela: string | null;
    cultivo: string | null;
    intensidad: string | null;
    superficie: number | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null; 

    constructor(id: string | null, referenciaCatastral: string | null, subparcela: string | null, cultivo: string | null, 
                intensidad: string | null, superficie: number | null, fechaAlta: Date | null, fechaModificacion: Date | null, 
                fechaBaja: Date | null) {
        this.id = id;
        this.referenciaCatastral = referenciaCatastral;
        this.subparcela = subparcela;
        this.cultivo = cultivo;
        this.intensidad = intensidad;
        this.superficie = superficie;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}