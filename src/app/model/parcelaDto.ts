import { Parcela } from "./parcela";
import { Subparcela } from "./subparcela";
import { UsuarioParcela } from "./usuario-parcela";

export class ParcelaDto {
    parcela: Parcela;
    subparcelas: Subparcela[];
    usuariosParcela: UsuarioParcela[] | null;

    constructor (parcela: Parcela, subparcelas: Subparcela[], usuariosParcela: UsuarioParcela[] | null) {
        this.parcela = parcela;
        this.subparcelas = subparcelas;
        this.usuariosParcela = usuariosParcela;
    }
}