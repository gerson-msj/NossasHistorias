import { DatabaseSync } from "node:sqlite";
import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import { CurtirRequestModel } from "../models/request.model.ts";

class VisualizacoesService {
    private db: DatabaseSync;

    constructor(db: DatabaseSync) {
        this.db = db;
    }

    public curtir(request: CurtirRequestModel, idUsuario: number) {
        const sql = "Update Visualizacoes Set Curtida = ? Where IdUsuario = ? And IdHistoria = ?";
        const query = this.db.prepare(sql);
        query.run(request.curtida ? 1 : 0, idUsuario, request.idHistoria);
    }
}

export default class VisualizacoesController extends Controller<VisualizacoesService> {

    public override async handle(context: Context): Promise<Response> {
        if (context.url.pathname != "/api/visualizacoes")
            return this.nextHandle(context);

        if (["PUT"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new VisualizacoesService(db);
        }

        if (context.tokenSub === null)
            return context.unauthorized();

        switch (context.request.method) {
            case "PUT": {
                const request = await context.getRequest<CurtirRequestModel>();
                this.service.curtir(request, context.tokenSub);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}