export class UsuarioInfo {
    id: string | null;
    nombre: string  | null;
    apellido1: string | null;
    apellido2: string | null;
    dni: string | null;
    username: string | null;
    email: string | null;
    rol: string| null;

    constructor(id: string | null, nombre: string | null, apellido1: string | null, apellido2: string | null, 
            username: string | null, email: string | null, dni: string | null, rol: string | null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.username = username;
        this.email = email;
        this.dni = dni;
        this.rol = rol;
    }
}