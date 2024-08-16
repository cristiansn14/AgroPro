export class ChangePassword {
    idUsuario: string | null;
    password1: string | null;
    password2: string | null;

    constructor(idUsuario: string | null, password1: string | null, password2: string | null) {
        this.idUsuario = idUsuario;
        this.password1 = password1;
        this.password2 = password2;
    }
}