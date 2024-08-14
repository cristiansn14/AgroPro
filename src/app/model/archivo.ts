export class Archivo {
    id: string;
    name: string;
    type: string;
    data: Blob;

    constructor(id: string, name: string, type: string, data: Blob) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.data = data;
    }
}