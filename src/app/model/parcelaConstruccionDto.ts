import { ParcelaConstruccion } from "./parcelaConstruccion";
import { UsuarioParcela } from "./usuario-parcela";

export class ParcelaConstruccionDto {
    parcelaConstruccion: ParcelaConstruccion;
    usuariosParcela: UsuarioParcela[];

    constructor (parcelaConstruccion: ParcelaConstruccion, usuariosParcela: UsuarioParcela[]) {
        this.parcelaConstruccion = parcelaConstruccion;
        this.usuariosParcela = usuariosParcela;
    }
}