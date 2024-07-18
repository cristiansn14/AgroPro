export class UsuarioParcela {
    id: string | null;
    participacion: number | null;
    usuario: string | null;
    parcela: string | null;
    parcelaConstruccion: string | null;
    fechaAlta: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, participacion: number | null, usuario: string | null, parcela: string | null, parcelaConstruccion: string | null, fechaAlta: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.participacion = participacion;
        this.usuario = usuario;
        this.parcela = parcela;
        this.parcelaConstruccion = parcelaConstruccion;
        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
    }
}