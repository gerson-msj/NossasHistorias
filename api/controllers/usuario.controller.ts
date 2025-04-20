import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import { DatabaseSync } from "node:sqlite";
import ServerCrypt from "../services/server.crypt.ts";
import { Usuario } from "../models/db.model.ts";
import { UsuarioResponseModel } from "../models/response.model.ts";
import DateService from "../services/date.service.ts";

class UsuarioService {

    private db: DatabaseSync;
    private crypt: ServerCrypt;

    constructor(db: DatabaseSync) {
        this.db = db;
        this.crypt = new ServerCrypt();
    }

    public novo(): number {
        const sql = "Insert Into Usuarios (DataCriacao, Moderador) Values (?, ?)";
        const query = this.db.prepare(sql);
        const queryResult = query.run(DateService.DiaAtual(), 0);
        return queryResult.lastInsertRowid as number;
    }

    public criarToken(id: number): Promise<string> {
        return this.crypt.criarToken(id);
    }

    public async obterUsuario(tokenOrId: string | number): Promise<UsuarioResponseModel> {

        let id: number | undefined;
        if(typeof tokenOrId === "number")
            id = tokenOrId;
        else if (await this.crypt.tokenValido(tokenOrId))
            id = this.crypt.tokenSub<number>(tokenOrId);

        let usuario: Usuario | undefined = undefined;
        if(id) {
            const sql = "Select * From Usuarios Where Id = ?";
            const query = this.db.prepare(sql);
            usuario = query.get(id) as Usuario;
        }

        return {
            usuarioExistente: usuario !== undefined,
            id: usuario?.Id,
            moderador: usuario?.Moderador == 1,
        };
    }

}

export default class UsuarioController extends Controller<UsuarioService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["GET", "POST"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new UsuarioService(db);
        }

        switch (context.request.method) {
            case "GET": {
                if (context.tokenSub === null)
                    return context.unauthorized();

                const token = context.getSearchParam("token");
                const response = await this.service.obterUsuario(token ?? context.tokenSub);

                return Promise.resolve(context.ok(response));
            }

            case "POST": {
                const id = this.service.novo();
                const token = await this.service.criarToken(id);
                return context.ok({ token: token });
            }

            default: {
                return context.notAllowed();
            }
        }


    }
}

