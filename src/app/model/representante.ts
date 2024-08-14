export class Representante {
    id: string | null;
    nombre: string  | null;
    apellido1: string | null;
    apellido2: string | null;
    email: string | null;
    dni: string | null;
    telefono: string | null;
    idUsuario: string  | null;
    fechaAlta: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, nombre: string | null, apellido1: string | null, apellido2: string | null, idUsuario: string  | null,
            email: string | null, dni: string | null, telefono: string | null, fechaAlta: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.idUsuario = idUsuario;
        this.email = email;
        this.dni = dni;
        this.telefono = telefono;
        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
    }
}