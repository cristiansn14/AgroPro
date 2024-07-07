export class JwtResponse {
    username: string;
    token: string;
    email: string;
    roles: string[];
    id: string;

    constructor(username: string, token: string, email: string, roles: string[], id: string) {
        this.username = username;
        this.token = token;
        this.email = email;
        this.roles = roles;
        this.id = id;
    }
}
