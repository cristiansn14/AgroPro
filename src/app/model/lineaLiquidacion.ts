export class LineaLiquidacion {
    id: string | null;
    importe: number | null;
    nombre: string | null;
    apellido1: string | null;
    apellido2: string | null;
    idUsuario: string | null;
    idLiquidacion: string | null;
    recibida: boolean;

    constructor(id: string | null, importe: number | null, nombre: string | null, apellido1: string | null, 
                apellido2: string | null, idUsuario: string | null, idLiquidacion: string | null, recibida: boolean) {
        this.id = id;
        this.importe = importe;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.idUsuario = idUsuario;
        this.idUsuario = idUsuario;
        this.idLiquidacion = idLiquidacion;
        this.recibida = recibida;
    }
}