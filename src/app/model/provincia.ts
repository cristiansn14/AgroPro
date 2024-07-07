export class Provincia {
    id: number;
    nombre: string;
    idComunidad: number;

    constructor(id: number, nombre: string, idComunidad: number) {
        this.id = id;
        this.nombre = nombre;
        this.idComunidad = idComunidad;
    }
}