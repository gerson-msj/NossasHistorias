import { TokenSubject } from "../../models/response.model.ts";
import ServerCrypt from "../../services/server.crypt.ts";
import sqlite from "node:sqlite";

export default class Context {

    public request: Request;
    public url: URL;
    private crypt: ServerCrypt;
    private headers = { "content-type": "application/json; charset=utf-8" };

    private _db: sqlite.DatabaseSync | null = null;
    public get db() { return this._db; }

    private _kv: Deno.Kv | null = null;
    public get kv() { return this._kv!; }

    public tokenSub: TokenSubject | null = null;

    public get isApiRequest(): boolean {
        return this.url.pathname.startsWith("/api");
    }

    constructor(request: Request) {
        this.request = request;
        this.url = new URL(request.url);
        this.crypt = new ServerCrypt();
    }


    public openDb(): sqlite.DatabaseSync {
        if (this._db === null) {
            this._db = new sqlite.DatabaseSync("api/data/nossas_historias.db", { readOnly: false, open: true });
        }
        return this._db;
    }

    public closeDb(): void {
        if (this._db !== null)
            this._db.close();
    }


    public async auth(): Promise<boolean> {

        try {
            this.tokenSub = null;

            const auth = this.request.headers.get("authorization");
            if (auth == null)
                return true;

            const token = auth.split(" ")[1];
            if (await this.crypt.tokenValido(token) && !this.crypt.tokenExpirado(token))
                this.tokenSub = this.crypt.tokenSub(token);

            return this.tokenSub != null
                && this.tokenSub.email != ''
                && (this.tokenSub.perfil == "Resp" || this.tokenSub.perfil == "Dep");

        } catch (error) {
            console.error("auth", error);
            return false;
        }

    }

    public ok<T>(obj: T): Response {
        return new Response(obj ? JSON.stringify(obj) : null, { status: 200, headers: this.headers });
    }

    public badRequest(message: string): Response {
        return new Response(JSON.stringify({ message: message }), { status: 400, headers: this.headers });
    }

    public serverError(): Response {
        return new Response(null, { status: 500, headers: this.headers });
    }

    public unauthorized(): Response {
        return new Response(JSON.stringify({ message: "não autorizado" }), { status: 401, headers: this.headers });
    }

    public notAllowed(): Response {
        return new Response(JSON.stringify({ message: "método não permitido" }), { status: 405, headers: this.headers });
    }
}