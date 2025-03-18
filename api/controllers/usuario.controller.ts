import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import { DatabaseSync } from "node:sqlite";
import ServerCrypt from "../services/server.crypt.ts";

export class UsuarioService {

    private db: DatabaseSync;
    private crypt: ServerCrypt;

    constructor(db: DatabaseSync) {
        this.db = db;
        this.crypt = new ServerCrypt();
    }

    public novo(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql = "Insert Into Usuarios (DataCriacao, Moderador) Values (?, ?)";
            const dt = new Date();
            const dataCriacao = dt.toJSON().split('T')[0];
            const moderador = 0;
            try {
                const query = this.db.prepare(sql);
                const queryResult = query.run(dataCriacao, moderador);
                const id = queryResult.lastInsertRowid as number;                
                resolve(id);
            } catch (error) {
                reject(error);
            }
        });
    }

    public criarToken(id: number): Promise<string> {
        return this.crypt.criarToken(id);
    }
}

export default class UsuarioController extends Controller<UsuarioService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["GET", "POST"].includes(context.request.method)) {
            const db = context.openDb();
            this.service = new UsuarioService(db);
        }

        switch (context.request.method) {
            case "GET": {
                // const request = context.url.searchParams.get("email");
                
                return Promise.resolve(context.ok({}));
            }

            case "POST": {
                // const request: LoginRequestModel = await context.request.json();
                const id = await this.service.novo();
                const token = await this.service.criarToken(id);
                return context.ok({token: token});
            }

            default: {
                return context.notAllowed();
            }
        }


    }
}

