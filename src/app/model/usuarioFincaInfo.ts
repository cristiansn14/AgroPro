export class UsuarioFincaInfo {
    id: string | null;
    onzas: number | null;
    nombre: string | null;
    apellido1: string | null;
    apellido2: string | null;
    rol: string | null;
    idUsuario: string | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, onzas: number | null, nombre: string | null, apellido1: string | null, 
                apellido2: string | null, rol: string | null, idUsuario: string | null, 
                fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.onzas = onzas;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.idUsuario = idUsuario;
        this.rol = rol;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}