import { TokenSubject } from "../../models/response.model.ts";
import ServerCrypt from "../../services/server.crypt.ts";

export default class Context {

    public request: Request;
    public url: URL;
    private crypt: ServerCrypt;

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

    public async openKv(): Promise<void> {
        if (this._kv === null)
            this._kv = await Deno.openKv();
    }

    public getDb(): Promise<Deno.Kv> {
        return Deno.openKv();
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
        return new Response(JSON.stringify(obj), { status: 200, headers: { "content-type": "application/json; charset=utf-8" } });
    }

    public badRequest(message: string): Response {
        return new Response(JSON.stringify({ message: message }), { status: 400, headers: { "content-type": "application/json; charset=utf-8" } });
    }

    public unauthorized(): Response {
        return new Response(JSON.stringify({ message: "não autorizado" }), { status: 401, headers: { "content-type": "application/json; charset=utf-8" } });
    }

    public notAllowed(): Response {
        return new Response(JSON.stringify({ message: "método não permitido" }), { status: 405, headers: { "content-type": "application/json; charset=utf-8" } });
    }
}