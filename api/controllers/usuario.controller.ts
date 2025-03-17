import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import { DatabaseSync } from "node:sqlite";
import ServerCrypt from "../services/server.crypt.ts";

export class UsuarioService {

    private db: DatabaseSync;
    private crypt: ServerCrypt;

    constructor(db: DatabaseSync) {
        this.db = db;
        this.db.close();
        this.crypt = new ServerCrypt();
    }
}

export default class UsuarioController extends Controller<UsuarioService> {

    public override handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["GET", "POST"].includes(context.request.method)) {
            const db = context.getDb();
            db.open();
            this.service = new UsuarioService(db);
        }

        switch (context.request.method) {
            case "GET": {
                // const request = context.url.searchParams.get("email");
                return Promise.resolve(context.ok({}));
            }

            case "POST": {
                // const request: LoginRequestModel = await context.request.json();
                return Promise.resolve(context.ok({}));;
            }

            default: {
                return Promise.resolve(context.notAllowed());
            }
        }
    }
}

