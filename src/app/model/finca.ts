export class Finca {
    id: string | null;
    nombre: string | null;
    onzas: number | null;
    comunidad: number | null;
    provincia: number | null;
    municipio: number | null;
    fechaAlta: Date | null;
    fechaModificacion: Date | null;
    fechaBaja: Date | null;

    constructor(id: string | null, nombre: string | null, onzas: number | null, comunidad: number | null, 
                provincia: number | null, municipio: number | null, fechaAlta: Date | null, 
                fechaModificacion: Date | null, fechaBaja: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.onzas = onzas;
        this.comunidad = comunidad;
        this.provincia = provincia;
        this.municipio = municipio;
        this.fechaAlta = fechaAlta;
        this.fechaModificacion = fechaModificacion;
        this.fechaBaja = fechaBaja;
    }
}