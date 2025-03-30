import { DatabaseSync } from "node:sqlite";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { HistoriaModeradorResponseModel } from "../models/response.model.ts";
import { Historia } from "../models/db.model.ts";

class ModeradorService {
    private db: DatabaseSync;

    constructor(db: DatabaseSync) {
        this.db = db;
    }

    public obterPendente(): HistoriaModeradorResponseModel {
        const sql = "Select Id, Titulo, Conteudo From Historias Where IdSituacao = 1 Order By Id Asc Limit 1;"
        const query = this.db.prepare(sql);
        const result = query.get() as Historia;
        return result ? {
            id: result.Id,
            titulo: result.Titulo,
            conteudo: result.Conteudo
        } : {
            id: 0,
            titulo: "",
            conteudo: ""
        };
    }
}

export default class ModeradorController extends Controller<ModeradorService> {

    public override async handle(context: Context): Promise<Response> {
        if (context.url.pathname != "/api/moderador")
            return this.nextHandle(context);

        if (context.tokenSub === null)
            return context.unauthorized();

        if (["GET"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new ModeradorService(db);
        }

        switch (context.request.method) {
            case "GET": {
                const response = this.service.obterPendente();
                return context.ok(response);
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}