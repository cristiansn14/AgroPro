export class UsuarioFinca {
    id: string | null;
    onzas: number | null;
    usuario: string | null;
    finca: string | null;
    rol: string | null;
    fechaAlta: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, onzas: number | null, usuario: string | null, finca: string | null, rol: string | null, fechaAlta: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.onzas = onzas;
        this.usuario = usuario;
        this.finca = finca;
        this.rol = rol;
        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
    }
}