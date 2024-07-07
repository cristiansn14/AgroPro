export class SignupRequest {
    nombre: string;
    apellido1: string;
    apellido2: string;
    username: string;
    email: string;
    password: string;
    rol: string | null;
    
    constructor(nombre: string, apellido1: string, apellido2: string, username: string, email: string, password: string,  rol: string | null) {
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }
}