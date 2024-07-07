export class Municipio {
    id: number;
    nombre: string;
    idComunidad: number;
    idProvincia: number;
    idMunicipio: number;

    constructor(id: number, nombre: string, idComunidad: number, idProvincia: number, idMunicipio: number) {
        this.id = id;
        this.nombre = nombre;
        this.idComunidad = idComunidad;
        this.idProvincia = idProvincia;
        this.idMunicipio = idMunicipio;
    }
}