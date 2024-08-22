export class FincaInfo {
    id: string | null;
    nombre: string | null;
    onzas: number | null;
    idComunidad: number | null;
    nombreComunidad: string | null;
    idProvincia: number | null;
    nombreProvincia: string | null;
    idMunicipio: number | null;
    nombreMunicipio: string | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, nombre: string | null, onzas: number | null, idComunidad: number | null, nombreComunidad: string | null,
                idProvincia: number | null, nombreProvincia: string | null, idMunicipio: number | null, nombreMunicipio: string | null, 
                fechaAlta: Date | null, fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.onzas = onzas;
        this.idComunidad = idComunidad;
        this.nombreComunidad = nombreComunidad;
        this.idProvincia = idProvincia;
        this.nombreProvincia = nombreProvincia;
        this.idMunicipio = idMunicipio;
        this.nombreMunicipio = nombreMunicipio;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}