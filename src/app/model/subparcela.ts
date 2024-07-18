export class Subparcela{
    id: string | null;
    referenciaCatastral: string | null;
    subparcela: string | null;
    cultivo: number | null;
    intensidad: string | null;
    superficie: number | null;

    constructor(id: string | null, referenciaCatastral: string | null, subparcela: string | null, cultivo: number | null, 
                intensidad: string | null, superficie: number | null) {
        this.id = id;
        this.referenciaCatastral = referenciaCatastral;
        this.subparcela = subparcela;
        this.cultivo = cultivo;
        this.intensidad = intensidad;
        this.superficie = superficie;
    }
}
