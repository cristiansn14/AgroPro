export class UsuarioParcelaInfo {
    idUsuario: string | null;
    nombre: string | null;
    apellido1: string | null;
    apellido2: string | null;
    participacion: number | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(idUsuario: string | null, nombre: string | null, apellido1: string | null, apellido2: string | null, participacion: number | null, fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.participacion = participacion;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}