import { DatabaseSync } from "node:sqlite";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { HistoriaModeradorResponseModel } from "../models/response.model.ts";
import { Historia } from "../models/db.model.ts";
import DateService from "../services/date.service.ts";
import { HistoriaModeracaoRequestModel } from "../models/request.model.ts";

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

    public moderar(idUsuarioModerador: number, request: HistoriaModeracaoRequestModel) {
        const sql = "Update Historias Set IdUsuarioModerador = ?, IdSituacao = ?, MotivoModeracao = ?, DataHoraModeracao = ? Where Id = ?";
        const query = this.db.prepare(sql);
        query.run(idUsuarioModerador, request.idSituacao, request.motivoModeracao ?? null, DateService.DiaHoraAtual(), request.idHistoria);
    }
}

export default class ModeradorController extends Controller<ModeradorService> {

    public override async handle(context: Context): Promise<Response> {
        if (context.url.pathname != "/api/moderador")
            return this.nextHandle(context);

        if (context.tokenSub === null)
            return context.unauthorized();

        if (["GET", "PUT"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new ModeradorService(db);
        }

        switch (context.request.method) {
            case "GET": {
                const response = this.service.obterPendente();
                return context.ok(response);
            }

            case "PUT": {
                const request: HistoriaModeracaoRequestModel = await context.request.json();
                this.service.moderar(context.tokenSub, request);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}