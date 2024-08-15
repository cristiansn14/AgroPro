export class Parcela{
    referenciaCatastral: string | null;
    poligono: string | null;
    parcela: string | null;
    paraje: string | null;
    idFinca: string | null;
    clase: string | null;
    usoPrincipal: string | null;
    superficie: number | null;
    valorSuelo: number | null;
    valorConstruccion: number | null;
    valorCatastral: number | null;
    anoValor: string | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(referenciaCatastral: string | null, poligono: string | null, parcela: string | null, paraje: string | null, 
                idFinca: string | null, clase: string | null, usoPrincipal: string | null, superficie: number | null,
                valorSuelo: number | null, valorConstruccion: number | null, valorCatastral: number | null, 
                anoValor: string | null, fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.referenciaCatastral = referenciaCatastral;
        this.poligono = poligono;
        this.parcela = parcela;
        this.paraje = paraje;
        this.idFinca = idFinca;
        this.clase = clase;
        this.usoPrincipal = usoPrincipal;
        this.superficie = superficie;
        this.valorSuelo = valorSuelo;
        this.valorConstruccion = valorConstruccion;
        this.valorCatastral = valorCatastral;
        this.anoValor = anoValor;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}