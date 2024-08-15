export class Subparcela{
    id: string | null;
    referenciaCatastral: string | null;
    subparcela: string | null;
    codigoCultivo: string | null;
    descripcionCultivo: string | null;
    intensidadProductiva: string | null;
    superficie: number | null;

    constructor(id: string | null, referenciaCatastral: string | null, subparcela: string | null, codigoCultivo: string | null, 
                descripcionCultivo: string | null, intensidadProductiva: string | null, superficie: number | null) {
        this.id = id;
        this.referenciaCatastral = referenciaCatastral;
        this.subparcela = subparcela;
        this.codigoCultivo = codigoCultivo;
        this.descripcionCultivo = descripcionCultivo;
        this.intensidadProductiva = intensidadProductiva;
        this.superficie = superficie;
    }
}
