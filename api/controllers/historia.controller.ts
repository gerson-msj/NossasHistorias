import { DatabaseSync } from "node:sqlite";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { HistoriaRequestModel } from "../models/request.model.ts";
import { Historia, Situacao } from "../models/db.model.ts";
import DateService from "../services/date.service.ts";

class HistoriaService {
     private db: DatabaseSync;

    constructor(db: DatabaseSync) {
        this.db = db;
    }

    public Incluir(idUsuarioAutor: number, request: HistoriaRequestModel): void {
        const historia: Historia = {
            Id: 0,
            IdUsuarioAutor: idUsuarioAutor,
            IdUsuarioModerador: null,
            Titulo: request.titulo,
            Conteudo: request.conteudo,
            IdSituacao: Situacao.analise,
            DataHoraCriacao: DateService.DiaHoraAtual(),
            MotivoModeracao: null,
            DataHoraModeracao: null
        };
    }
}

export default class HistoriaController extends Controller<HistoriaService> {

    public override async handle(context: Context): Promise<Response> {
        
        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["POST"].includes(context.request.method)) {
            const db = context.openDb();
            this.service = new HistoriaService(db);
        }
        
        if(context.tokenSub === null)
            return context.unauthorized();

        switch  (context.request.method) {
            case "POST": {
                const request: HistoriaRequestModel = await context.request.json();
                await this.service.Incluir(context.tokenSub, request);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }

    }

}
