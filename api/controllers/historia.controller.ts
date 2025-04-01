import { DatabaseSync } from "node:sqlite";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { HistoriaRequestModel, HistoriaResponseModel } from "../models/request.model.ts";
import { Situacao } from "../models/db.model.ts";
import DateService from "../services/date.service.ts";

class HistoriaService {
    private db: DatabaseSync;

    constructor(db: DatabaseSync) {
        this.db = db;
    }

    public incluir(idUsuarioAutor: number, request: HistoriaRequestModel): number {
        const sql = "Insert Into Historias (IdUsuarioAutor, Titulo, Conteudo, IdSituacao, DataHoraCriacao) Values (?, ?, ?, ?, ?)";
        const query = this.db.prepare(sql);
        const queryResult = query.run(idUsuarioAutor, request.titulo, request.conteudo, Situacao.analise, DateService.DiaHoraAtual());
        return queryResult.lastInsertRowid as number;
    }

    public proxima(idUsuario: number): HistoriaResponseModel | undefined {
        const proxima = this.obterProxima(idUsuario);
        if(proxima)
            this.registrarVisualizacao(idUsuario, proxima.id);

        return proxima;
    }

    private registrarVisualizacao(idUsuario: number, idHistoria: number) {
        const sql = "Insert into Visualizacoes (IdUsuario, IdHistoria, Curtida) Values (?, ?, 0)";
        const query = this.db.prepare(sql);
        query.run(idUsuario, idHistoria);
    }

    private obterProxima(idUsuario: number): HistoriaResponseModel | undefined {
        const sql = this.sqlProxima();
        const query = this.db.prepare(sql);
        return query.get(idUsuario) as HistoriaResponseModel | undefined;
    }

    private sqlProxima(): string {
        return `        
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
            ), cteHistorias as (
                Select
                    h.Id, h.Titulo, h.Conteudo, c.Visualizacoes, c.Curtidas
                From 
                    Historias as h
                    Inner Join cteContagem as c
                        on c.Id = h.Id
                    Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id And v.IdUsuario = ?
                    Where 
                        v.IdHistoria is null
                        And h.IdSituacao = 2
            )
            Select 
                *
            From
                cteHistorias
            Limit
                1
            Offset 
                coalesce(abs(random()) % (Select Count(*) From cteHistorias), 0)
            ;
        `;
    }
}

export default class HistoriaController extends Controller<HistoriaService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/historia")
            return this.nextHandle(context);

        if (["GET", "POST"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new HistoriaService(db);
        }

        if (context.tokenSub === null)
            return context.unauthorized();

        switch (context.request.method) {
            case "GET": {
                const response = this.service.proxima(context.tokenSub);
                return context.ok(response);
            }
            
            case "POST": {
                const request: HistoriaRequestModel = await context.request.json();
                this.service.incluir(context.tokenSub, request);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }

    }

}
