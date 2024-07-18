export class Parcela{
    referenciaCatastral: string | null;
    poligonoParcela: number | null;
    paraje: number | null;
    idFinca: string | null;
    clase: string | null;
    usoPrincipal: string | null;
    superficie: number | null;
    valorSuelo: number | null;
    valorConstruccion: number | null;
    valorCatastral: number | null;
    añoValor: string | null;

    constructor(referenciaCatastral: string | null, poligonoParcela: number | null, paraje: number | null, 
                idFinca: string | null, clase: string | null, usoPrincipal: string | null, superficie: number | null,
                valorSuelo: number | null, valorConstruccion: number | null, valorCatastral: number | null, añoValor: string | null) {
        this.referenciaCatastral = referenciaCatastral;
        this.poligonoParcela = poligonoParcela;
        this.paraje = paraje;
        this.idFinca = idFinca;
        this.clase = clase;
        this.usoPrincipal = usoPrincipal;
        this.superficie = superficie;
        this.valorSuelo = valorSuelo;
        this.valorConstruccion = valorConstruccion;
        this.valorCatastral = valorCatastral;
        this.añoValor = añoValor;
    }
}