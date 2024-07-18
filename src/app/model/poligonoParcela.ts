export class PoligonoParcela {
    id: number | null;
    poligono: number | null;
    parcela: string | null;

    constructor(id: number | null, poligono: number | null, parcela: string | null) {
        this.id = id;
        this.poligono = poligono;
        this.parcela = parcela;
    }
}