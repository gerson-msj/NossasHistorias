import { MinhaHistoriaResponseModel, MinhasHistoriasResponseModel } from "../models/response.model.ts";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import Service from "./base/service.ts";

class MinhasHistoriasService extends Service {
    public obter(idUsuario: number, pagina: number): MinhasHistoriasResponseModel {

        const response: MinhasHistoriasResponseModel = {
            pagina: pagina,
            paginas: 0,
            total: 0,
            parcial: 0,
            historias: []
        }

        response.total = this.obterTotal(idUsuario);
        if (response.total == 0 || response.pagina <= 0)
            return response;

        const limit = 4;
        response.paginas = Math.ceil(response.total / limit);

        if (response.pagina > response.paginas)
            return response;

        const offset = (response.pagina - 1) * limit;
        response.historias = this.obterHistorias(idUsuario, limit, offset);
        response.parcial = response.historias.length;
        return response;
    }

    public excluir(idHistoria: number) {
        const sql = "Delete From Historias Where Id = ?";
        const query = this.db.prepare(sql);
        query.run(idHistoria);
    }

    private obterTotal(idUsuario: number): number {
        const sql = "Select Count(*) as historias From Historias Where IdUsuarioAutor = ?";
        const query = this.db.prepare(sql);
        const result = query.get(idUsuario) as { historias: number };
        return result?.historias ?? 0;
    }

    private obterHistorias(idUsuario: number, limit: number, offset: number): MinhaHistoriaResponseModel[] {
        const sql = `
            With cteContagem as (
                Select 
                    h.Id, 
                    Count(v.IdHistoria) as Visualizacoes,
                    Sum(Case When v.Curtida = 1 Then 1 Else 0 End) as Curtidas 
                From 
                    Historias as h 
                    Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id
                Group By
                    h.Id
            )
            Select
                h.Id as id, 
                h.Titulo as titulo, 
                h.Conteudo as conteudo,
                s.Descricao as situacao,
                coalesce(c.Visualizacoes, 0) as visualizacoes,
                coalesce(c.Curtidas, 0) as curtidas
            From 
                Historias as h
                Inner Join HistoriaSituacao as s
                    on s.Id = h.IdSituacao
                Left Join cteContagem as c
                    on c.Id = h.Id
            Where 
                h.IdUsuarioAutor = ?
            Order By
                s.Ordem asc, 6 desc, 5 desc, h.Id desc
            Limit
                ?
            Offset
                ?
            ;        
        `;

        const query = this.db.prepare(sql);
        return query.all(idUsuario, limit, offset) as MinhaHistoriaResponseModel[];
    }
}

export default class MinhasHistoriasController extends Controller<MinhasHistoriasService> {

    public override async handle(context: Context): Promise<Response> {
        if (context.url.pathname != "/api/minhas-historias")
            return this.nextHandle(context);

        if (["GET", "DELETE"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new MinhasHistoriasService();
            this.service.db = db;
        }

        if (context.tokenSub === null)
            return context.unauthorized();

        switch (context.request.method) {
            case "GET": {
                const request = context.getSearchParam("pagina");
                const pagina = request ? parseInt(request) : undefined;
                if (pagina == undefined)
                    return context.badRequest("Página não informada");

                const response = this.service.obter(context.tokenSub, pagina);
                return context.ok(response);
            }

            case "DELETE": {
                const idHistoria = context.getSearchParamInt("idHistoria");
                if(!idHistoria)
                    return context.badRequest("Id não informado");
                
                this.service.excluir(idHistoria);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}