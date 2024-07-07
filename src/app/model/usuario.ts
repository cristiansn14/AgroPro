export class Usuario {
    id: string | null;
    nombre: string  | null;
    apellido1: string | null;
    apellido2: string | null;
    username: string | null;
    email: string | null;
    dni: string | null;
    fechaAlta: Date | null;

    constructor(id: string | null, nombre: string | null, apellido1: string | null, apellido2: string | null, username: string | null, email: string | null, dni: string | null, fechaAlta: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.username = username;
        this.email = email;
        this.dni = dni;
        this.fechaAlta = fechaAlta;
    }
}