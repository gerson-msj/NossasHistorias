import { HistoriaResponseModel, HistoriasResponseModel } from "../models/response.model.ts";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import Service from "./base/service.ts";

class HistoriasVisualizadasService extends Service {
    public obter(idUsuario: number, pagina: number, titulo: string, curtida: number): HistoriasResponseModel {

        const response: HistoriasResponseModel = {
            pagina: pagina,
            paginas: 1,
            total: 0,
            parcial: 0,
            historias: []
        }

        titulo = titulo === "" ? "" : `%${titulo}%`;

        response.total = this.obterTotal(idUsuario, titulo!, curtida);
        if (response.total == 0 || response.pagina <= 0)
            return response;

        const limit = 10;
        response.paginas = Math.ceil(response.total / limit);

        if (response.pagina > response.paginas)
            response.pagina = response.paginas;

        const offset = (response.pagina - 1) * limit;
        response.historias = this.obterHistorias(idUsuario, titulo!, curtida, limit, offset);
        response.parcial = response.historias.length;
        return response;
    }

    private obterTotal(idUsuario: number, titulo: string, curtida: number): number {
        const sql = `
            Select 
                Count(*) as historias
            From 
                Historias as h
                Inner Join Visualizacoes as v 
                    on v.IdHistoria = h.Id
            Where 
                v.IdUsuario = ?
                And h.IdSituacao = 2
                And (? = "" Or h.Titulo like ?)
                And (? = 0 Or v.Curtida = 1)
        `;
        const query = this.db.prepare(sql);
        const result = query.get(idUsuario, titulo, titulo, curtida) as { historias: number };
        return result?.historias ?? 0;
    }

    private obterHistorias(idUsuario: number, titulo: string, curtida: number, limit: number, offset: number): HistoriaResponseModel[] {
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
                Inner Join Visualizacoes as v 
                    on v.IdHistoria = h.Id
                Left Join cteContagem as c
                    on c.Id = h.Id
            Where 
                v.IdUsuario = ?
                And h.IdSituacao = 2
                And (? = "" Or h.Titulo like ?)
                And (? = 0 Or v.Curtida = 1)
            Order By
                s.Ordem asc, 6 desc, 5 desc, h.Id desc
            Limit
                ?
            Offset
                ?
            ;        
        `;

        const query = this.db.prepare(sql);
        return query.all(idUsuario, titulo, titulo, curtida, limit, offset) as HistoriaResponseModel[];
    }
}

export default class HistoriasVisualizadasController extends Controller<HistoriasVisualizadasService> {

    public override async handle(context: Context): Promise<Response> {
        if (context.url.pathname != "/api/historias-visualizadas")
            return this.nextHandle(context);

        if (["GET"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new HistoriasVisualizadasService();
            this.service.db = db;
        }

        if (context.tokenSub === null)
            return context.unauthorized();

        switch (context.request.method) {
            case "GET": {
                const pagina = context.getSearchParamNumber("pagina") ?? 1;
                const titulo = context.getSearchParam("titulo") ?? "";
                const curtida = context.getSearchParamNumber("curtida") ?? 0;

                const response = this.service.obter(context.tokenSub, pagina, titulo, curtida);
                return context.ok(response);
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}