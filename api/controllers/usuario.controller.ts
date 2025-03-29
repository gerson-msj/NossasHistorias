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

    public novo(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql = "Insert Into Usuarios (DataCriacao, Moderador) Values (?, ?)";
            try {
                const query = this.db.prepare(sql);
                const queryResult = query.run(DateService.DiaAtual(), 0);
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

    public obterUsuario(id: number): Usuario | undefined {
        const sql = "Select * From Usuarios Where Id = ?";
        const query = this.db.prepare(sql);
        return query.get(id) as Usuario;
    }

    public obterUsuarioResponseModel(usuario: Usuario | undefined): UsuarioResponseModel {
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
            const db = context.openDb();
            this.service = new UsuarioService(db);
        }

        switch (context.request.method) {
            case "GET": {
                if (context.tokenSub === null)
                    return context.unauthorized();

                const usuario = this.service.obterUsuario(context.tokenSub);
                const response = this.service.obterUsuarioResponseModel(usuario);

                return Promise.resolve(context.ok(response));
            }

            case "POST": {
                // const request: LoginRequestModel = await context.request.json();
                const id = await this.service.novo();
                const token = await this.service.criarToken(id);
                return context.ok({ token: token });
            }

            default: {
                return context.notAllowed();
            }
        }


    }
}

