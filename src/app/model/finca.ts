export class Finca {
    id: string | null;
    nombre: string | null;
    onzas: number | null;
    comunidad: number | null;
    provincia: number | null;
    municipio: number | null;

    constructor(id: string | null, nombre: string | null, onzas: number | null, comunidad: number | null, provincia: number | null, municipio: number | null) {
        this.id = id;
        this.nombre = nombre;
        this.onzas = onzas;
        this.comunidad = comunidad;
        this.provincia = provincia;
        this.municipio = municipio;
    }
}