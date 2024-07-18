import { Parcela } from "./parcela";
import { Recinto } from "./recinto";
import { Subparcela } from "./subparcela";
import { UsuarioParcela } from "./usuario-parcela";

export class ParcelaDto {
    parcela: Parcela;
    subparcelas: Subparcela[];
    recintos: Recinto[];
    usuariosParcela: UsuarioParcela[];

    constructor (parcela: Parcela, subparcelas: Subparcela[], recintos: Recinto[], usuariosParcela: UsuarioParcela[]) {
        this.parcela = parcela;
        this.subparcelas = subparcelas;
        this.recintos = recintos;
        this.usuariosParcela = usuariosParcela;
    }
}