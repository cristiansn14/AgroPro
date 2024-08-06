export class Movimiento {
    id: string | null;
    concepto: string | null;
    tipo: string | null;
    importe: number | null;
    idFinca: string | null;

    constructor(id: string | null, concepto: string | null, tipo: string | null, importe: number | null, idFinca: string | null) {
        this.id = id;
        this.concepto = concepto;
        this.tipo = tipo;
        this.importe = importe;
        this.idFinca = idFinca;
    }
}