export class Cultivo {
    id: number | null;
    codigo: string | null;
    descripcion: string | null;

    constructor(id: number | null, codigo: string | null, descripcion: string | null) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
    }
}