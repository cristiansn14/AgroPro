export class Usuario {
    id: string | null;
    nombre: string  | null;
    apellido1: string | null;
    apellido2: string | null;
    username: string | null;
    email: string | null;
    dni: string | null;
    telefono: string | null;
    comunidad: string| null;
    provincia: string | null;
    municipio: string | null;
    direccion: string| null;
    codigoPostal: string | null;
    cuenta: string | null;
    fechaAlta: Date | null;

    constructor(id: string | null, nombre: string | null, apellido1: string | null, apellido2: string | null, 
            username: string | null, email: string | null, dni: string | null, telefono: string | null, 
            comunidad: string | null, provincia: string | null, municipio: string | null, direccion: string | null, 
            codigoPostal: string | null, cuenta: string | null, fechaAlta: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.username = username;
        this.email = email;
        this.dni = dni;
        this.telefono = telefono;
        this.comunidad = comunidad;
        this.provincia = provincia;
        this.municipio = municipio;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.cuenta = cuenta;
        this.fechaAlta = fechaAlta;
    }
}