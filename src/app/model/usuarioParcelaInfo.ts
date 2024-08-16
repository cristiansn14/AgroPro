export class UsuarioParcelaInfo {
    id: string | null;
    nombre: string | null;
    apellido1: string | null;
    apellido2: string | null;
    participacion: number | null;
    idUsuario: string | null;
    referenciaCatastral: string | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, idUsuario: string | null, nombre: string | null, apellido1: string | null, 
                apellido2: string | null, participacion: number | null, referenciaCatastral: string | null,
                fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.participacion = participacion;
        this.idUsuario = idUsuario;
        this.referenciaCatastral = referenciaCatastral;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}